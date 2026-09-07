'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import MediaSelector from '@/components/admin/media-selector'
import {
  ArrowLeft, Plus, Pencil, Loader2, Trash2, Layers, Search, ChevronUp, ChevronDown, X,
} from 'lucide-react'
import { toast } from 'sonner'

interface ProductGroup {
  id: string
  name: string
  description: string | null
  image_url: string | null
  product_ids: string[]
  sort_order: number
  is_active: boolean
}

interface StripeProduct {
  id: string
  name: string
  description: string | null
  active: boolean
  image: string | null
  unit_amount: number | null
  currency: string
  product_type: string
}

const emptyForm = {
  name: '',
  description: '',
  image_url: '',
  product_ids: [] as string[],
  sort_order: '0',
  is_active: true,
}

export default function AdminGruposPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [user, setUser] = useState<any>(null)
  const [groups, setGroups] = useState<ProductGroup[]>([])
  const [products, setProducts] = useState<StripeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [productSearch, setProductSearch] = useState('')

  const fetchGroups = useCallback(async () => {
    const { data, error } = await supabase
      .from('shop_product_groups')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      toast.error('Error al cargar grupos: ' + error.message)
      return
    }
    setGroups(data ?? [])
  }, [supabase])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/admin/login'); return }
      setUser(user)

      // Productos de Stripe (para elegir cuáles entran al grupo).
      try {
        const res = await fetch('/api/admin/stripe-products')
        const data = await res.json()
        if (res.ok) setProducts(Array.isArray(data) ? data : [])
      } catch {
        toast.error('Error al cargar productos de Stripe')
      }

      await fetchGroups()
      setLoading(false)
    }
    init()
  }, [supabase, router, fetchGroups])

  const productById = (id: string) => products.find((p) => p.id === id)

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm, sort_order: String(groups.length) })
    setProductSearch('')
    setDialogOpen(true)
  }

  const openEdit = (g: ProductGroup) => {
    setEditingId(g.id)
    setForm({
      name: g.name,
      description: g.description ?? '',
      image_url: g.image_url ?? '',
      product_ids: [...(g.product_ids ?? [])],
      sort_order: String(g.sort_order ?? 0),
      is_active: g.is_active,
    })
    setProductSearch('')
    setDialogOpen(true)
  }

  const toggleProduct = (id: string) => {
    setForm((prev) => ({
      ...prev,
      product_ids: prev.product_ids.includes(id)
        ? prev.product_ids.filter((p) => p !== id)
        : [...prev.product_ids, id],
    }))
  }

  // Mueve un producto dentro del grupo: ese orden es el que ve el cliente.
  const moveProduct = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      const next = [...prev.product_ids]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...prev, product_ids: next }
    })
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('El nombre del grupo es requerido'); return }
    if (form.product_ids.length < 2) {
      toast.error('Un grupo necesita al menos 2 productos')
      return
    }

    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url || null,
      product_ids: form.product_ids,
      sort_order: parseInt(form.sort_order, 10) || 0,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    }

    const { error } = editingId
      ? await supabase.from('shop_product_groups').update(payload).eq('id', editingId)
      : await supabase.from('shop_product_groups').insert(payload)

    setSaving(false)

    if (error) { toast.error('Error al guardar: ' + error.message); return }

    toast.success(editingId ? 'Grupo actualizado' : 'Grupo creado')
    setDialogOpen(false)
    fetchGroups()
  }

  const handleDelete = async (g: ProductGroup) => {
    if (!confirm(`¿Eliminar el grupo "${g.name}"? Los productos NO se borran, solo dejan de mostrarse agrupados.`)) return
    const { error } = await supabase.from('shop_product_groups').delete().eq('id', g.id)
    if (error) { toast.error('Error al eliminar: ' + error.message); return }
    toast.success('Grupo eliminado')
    fetchGroups()
  }

  const toggleActive = async (g: ProductGroup) => {
    const { error } = await supabase
      .from('shop_product_groups')
      .update({ is_active: !g.is_active, updated_at: new Date().toISOString() })
      .eq('id', g.id)
    if (error) { toast.error('Error al actualizar: ' + error.message); return }
    fetchGroups()
  }

  const formatPrice = (amount: number | null, currency: string) => {
    if (amount == null) return '—'
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: (currency || 'mxn').toUpperCase(),
    }).format(amount / 100)
  }

  // Productos disponibles para agregar: activos, no elegidos ya, y que casen con la búsqueda.
  const availableProducts = products.filter((p) => {
    if (!p.active) return false
    if (form.product_ids.includes(p.id)) return false
    const q = productSearch.trim().toLowerCase()
    return !q || p.name.toLowerCase().includes(q)
  })

  // Un producto en dos grupos se mostraría dos veces en /shop: se avisa en la tabla.
  const groupsOfProduct = (productId: string) =>
    groups.filter((g) => (g.product_ids ?? []).includes(productId))

  if (!user) return <div className="p-8">Cargando...</div>

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/articulos">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Layers className="h-7 w-7 text-orange-500" /> Grupos de productos
            </h1>
            <p className="text-sm text-gray-500">
              Varios productos en una sola tarjeta con selector en /shop (ej. tallas de calcetines)
            </p>
          </div>
        </div>
        <Button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" /> Nuevo grupo
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border rounded-lg bg-white">
          <Layers className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p className="mb-1">Todavía no hay grupos.</p>
          <p className="text-sm text-gray-400">
            Crea uno para juntar, por ejemplo, todas las tallas de un mismo artículo.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.id} className={`border rounded-lg bg-white p-4 ${!g.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                  {(g.image_url || productById(g.product_ids?.[0] ?? '')?.image) && (
                    <Image
                      src={g.image_url || productById(g.product_ids[0])?.image || ''}
                      alt={g.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{g.name}</h3>
                    {g.is_active
                      ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Activo</Badge>
                      : <Badge variant="outline">Oculto</Badge>}
                    <Badge variant="secondary">{g.product_ids?.length ?? 0} productos</Badge>
                  </div>
                  {g.description && <p className="text-sm text-gray-500 mt-1">{g.description}</p>}

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(g.product_ids ?? []).map((pid) => {
                      const p = productById(pid)
                      return (
                        <span
                          key={pid}
                          className={`text-xs px-2 py-1 rounded-full border ${
                            p ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-red-50 text-red-600 border-red-200'
                          }`}
                          title={p ? formatPrice(p.unit_amount, p.currency) : 'Este producto ya no existe en Stripe'}
                        >
                          {p ? p.name : `⚠ ${pid}`}
                          {p && !p.active && ' (archivado)'}
                        </span>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Switch checked={g.is_active} onCheckedChange={() => toggleActive(g)} />
                  <Button variant="ghost" size="icon" onClick={() => openEdit(g)} title="Editar">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(g)} title="Eliminar">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogo crear/editar grupo */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar grupo' : 'Nuevo grupo'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Nombre del grupo *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Calcetines Jump-In"
              />
              <p className="text-xs text-gray-500 mt-1">Es el título que ve el cliente en la tarjeta.</p>
            </div>

            <div>
              <Label>Descripción del grupo</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="Opcional — si la dejas vacía se muestra la descripción del producto elegido"
              />
            </div>

            <div>
              <Label className="mb-1 block">Imagen del grupo</Label>
              <MediaSelector value={form.image_url} onSelect={(url) => setForm({ ...form, image_url: url })} />
              <p className="text-xs text-gray-500 mt-1">
                Opcional — si la dejas vacía se usa la imagen del producto que el cliente seleccione.
              </p>
            </div>

            {/* Productos del grupo */}
            <div className="rounded-lg border p-3 space-y-3">
              <div>
                <Label className="font-semibold">Productos del grupo *</Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mínimo 2. El orden de esta lista es el orden de las opciones en /shop.
                </p>
              </div>

              {form.product_ids.length > 0 && (
                <div className="space-y-1.5">
                  {form.product_ids.map((pid, index) => {
                    const p = productById(pid)
                    return (
                      <div key={pid} className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded px-2 py-1.5">
                        <span className="text-xs font-bold text-orange-500 w-5 shrink-0">{index + 1}.</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p ? p.name : `⚠ ${pid} (no existe en Stripe)`}</p>
                          {p && (
                            <p className="text-xs text-gray-500">
                              {formatPrice(p.unit_amount, p.currency)}
                              {!p.active && ' · archivado'}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => moveProduct(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-orange-500 disabled:opacity-30"
                          title="Subir"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveProduct(index, 1)}
                          disabled={index === form.product_ids.length - 1}
                          className="p-1 text-gray-400 hover:text-orange-500 disabled:opacity-30"
                          title="Bajar"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleProduct(pid)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Quitar del grupo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              <div>
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar producto para agregar…"
                    className="pl-8"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto border rounded divide-y">
                  {availableProducts.length === 0 ? (
                    <p className="text-sm text-gray-400 p-3 text-center">
                      No hay más productos que coincidan.
                    </p>
                  ) : (
                    availableProducts.map((p) => {
                      const otherGroups = groupsOfProduct(p.id).filter((g) => g.id !== editingId)
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggleProduct(p.id)}
                          className="w-full text-left px-3 py-2 hover:bg-orange-50 flex items-center gap-2"
                        >
                          <Plus className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                          <span className="flex-1 min-w-0 truncate text-sm">{p.name}</span>
                          {otherGroups.length > 0 && (
                            <span className="text-[10px] text-amber-600 shrink-0" title={`Ya está en: ${otherGroups.map((g) => g.name).join(', ')}`}>
                              ya agrupado
                            </span>
                          )}
                          <span className="text-xs text-gray-500 shrink-0">{formatPrice(p.unit_amount, p.currency)}</span>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label>Orden de la tarjeta</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
                <Label className="cursor-pointer">Visible en /shop</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingId ? 'Guardar cambios' : 'Crear grupo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
