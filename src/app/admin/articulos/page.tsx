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
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import MediaSelector from '@/components/admin/media-selector'
import { ArrowLeft, Plus, Pencil, Loader2, Archive, ArchiveRestore, Package, Search, X } from 'lucide-react'
import { toast } from 'sonner'

interface StripeProduct {
  id: string
  name: string
  description: string | null
  active: boolean
  image: string | null
  price_id: string | null
  unit_amount: number | null
  currency: string
  id_articulo: string
  product_type: string
  branch_id: string
}

interface Branch {
  id: string
  name: string
}

const PRODUCT_TYPES = [
  { value: 'access', label: 'Acceso (con fecha de visita)' },
  { value: 'article', label: 'Artículo' },
  { value: 'promotion', label: 'Promoción' },
]

const emptyForm = {
  name: '',
  description: '',
  image: '',
  price: '',
  product_type: 'access',
  id_articulo: '',
  branch_ids: [] as string[],
}

export default function AdminArticulosPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<StripeProduct[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })

  // --- Filtros de la tabla ---
  const [search, setSearch] = useState('')
  const [filterBranch, setFilterBranch] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stripe-products')
      const data = await res.json()
      if (res.ok) setProducts(Array.isArray(data) ? data : [])
      else toast.error(data.error || 'Error al cargar productos')
    } catch {
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/admin/login'); return }
      setUser(user)

      const { data: branchData } = await supabase
        .from('branches')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true })
      setBranches(branchData ?? [])

      fetchProducts()
    }
    init()
  }, [supabase, router, fetchProducts])

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setDialogOpen(true)
  }

  const openEdit = (p: StripeProduct) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      description: p.description ?? '',
      image: p.image ?? '',
      price: p.unit_amount != null ? String(p.unit_amount / 100) : '',
      product_type: p.product_type || 'access',
      id_articulo: p.id_articulo || '',
      branch_ids: p.branch_id ? p.branch_id.split(',').map((b) => b.trim()).filter(Boolean) : [],
    })
    setDialogOpen(true)
  }

  const toggleBranch = (branchId: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      branch_ids: checked
        ? [...prev.branch_ids, branchId]
        : prev.branch_ids.filter((b) => b !== branchId),
    }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('El nombre es requerido'); return }
    const priceNum = parseFloat(form.price)
    if (isNaN(priceNum) || priceNum <= 0) { toast.error('Ingresa un precio válido'); return }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image,
        price: priceNum,
        product_type: form.product_type,
        id_articulo: form.id_articulo.trim(),
        branch_ids: form.branch_ids,
      }

      const res = editingId
        ? await fetch(`/api/admin/stripe-products/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/stripe-products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')

      toast.success(editingId ? 'Producto actualizado' : 'Producto creado')
      setDialogOpen(false)
      fetchProducts()
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (p: StripeProduct) => {
    try {
      const res = await fetch(`/api/admin/stripe-products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !p.active }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(p.active ? 'Producto archivado' : 'Producto activado')
      fetchProducts()
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar')
    }
  }

  const formatPrice = (amount: number | null, currency: string) => {
    if (amount == null) return '—'
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: (currency || 'mxn').toUpperCase() }).format(amount / 100)
  }

  const branchNames = (branchId: string) => {
    if (!branchId) return 'Todas'
    const ids = branchId.split(',').map((b) => b.trim()).filter(Boolean)
    const names = ids.map((id) => branches.find((b) => b.id === id)?.name ?? '¿?')
    return names.join(', ')
  }

  const branchIdsOf = (branchId: string) =>
    branchId ? branchId.split(',').map((b) => b.trim()).filter(Boolean) : []

  const filtersActive = search.trim() !== '' || filterBranch !== 'all' || filterType !== 'all' || filterStatus !== 'all'

  const clearFilters = () => {
    setSearch('')
    setFilterBranch('all')
    setFilterType('all')
    setFilterStatus('all')
  }

  const filteredProducts = products.filter((p) => {
    // Búsqueda por nombre o Id_Articulo
    const q = search.trim().toLowerCase()
    if (q && !`${p.name} ${p.id_articulo}`.toLowerCase().includes(q)) return false

    // Sucursal: los productos sin sucursal aplican a "Todas", así que también entran
    if (filterBranch !== 'all') {
      const ids = branchIdsOf(p.branch_id)
      const matchesBranch = ids.length === 0 || ids.includes(filterBranch)
      if (!matchesBranch) return false
    }

    // Tipo de producto
    if (filterType !== 'all' && (p.product_type || 'access') !== filterType) return false

    // Estado
    if (filterStatus === 'active' && !p.active) return false
    if (filterStatus === 'archived' && p.active) return false

    return true
  })

  if (!user) return <div className="p-8">Cargando...</div>

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Package className="h-7 w-7 text-orange-500" /> Artículos (Stripe)
            </h1>
            <p className="text-sm text-gray-500">Productos que se venden en la tienda /shop</p>
          </div>
        </div>
        <Button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" /> Nuevo producto
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>No hay productos todavía. Crea el primero con “Nuevo producto”.</p>
        </div>
      ) : (
        <>
          {/* Barra de filtros */}
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs text-gray-500 mb-1 block">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nombre o Id_Articulo…"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="w-[180px]">
              <Label className="text-xs text-gray-500 mb-1 block">Sucursal</Label>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las sucursales</SelectItem>
                  {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[180px]">
              <Label className="text-xs text-gray-500 mb-1 block">Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {PRODUCT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[150px]">
              <Label className="text-xs text-gray-500 mb-1 block">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="archived">Archivados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtersActive && (
              <Button variant="ghost" onClick={clearFilters} className="text-gray-500">
                <X className="h-4 w-4 mr-1" /> Limpiar
              </Button>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-2">
            {filteredProducts.length} de {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-500 border rounded-lg bg-white">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Ningún producto coincide con los filtros.</p>
              <Button variant="link" onClick={clearFilters} className="text-orange-500">Limpiar filtros</Button>
            </div>
          ) : (
          <div className="border rounded-lg overflow-x-auto bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Sucursales</TableHead>
                  <TableHead>Id_Articulo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id} className={!p.active ? 'opacity-50' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(p.unit_amount, p.currency)}</TableCell>
                  <TableCell><Badge variant="secondary">{p.product_type}</Badge></TableCell>
                  <TableCell className="max-w-[180px] text-xs text-gray-600 truncate" title={branchNames(p.branch_id)}>
                    {branchNames(p.branch_id)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 max-w-[140px] truncate" title={p.id_articulo}>
                    {p.id_articulo || '—'}
                  </TableCell>
                  <TableCell>
                    {p.active
                      ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Activo</Badge>
                      : <Badge variant="outline">Archivado</Badge>}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleActive(p)} title={p.active ? 'Archivar' : 'Activar'}>
                      {p.active ? <Archive className="h-4 w-4 text-red-500" /> : <ArchiveRestore className="h-4 w-4 text-green-600" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          )}
        </>
      )}

      {/* Dialogo crear/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Nombre *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Acceso 1 hora" />
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Opcional — se muestra en /shop" />
            </div>

            <div>
              <Label>Precio (MXN) *</Label>
              <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="220" />
            </div>

            <div>
              <Label className="mb-1 block">Imagen</Label>
              <MediaSelector value={form.image} onSelect={(url) => setForm({ ...form, image: url })} />
            </div>

            <div>
              <Label>Tipo de producto</Label>
              <Select value={form.product_type} onValueChange={(v) => setForm({ ...form, product_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Id_Articulo</Label>
              <Input value={form.id_articulo} onChange={(e) => setForm({ ...form, id_articulo: e.target.value })} placeholder="Identificador para el webhook de venta" />
            </div>

            <div>
              <Label className="mb-2 block">Sucursales</Label>
              <p className="text-xs text-gray-500 mb-2">Si no seleccionas ninguna, el producto estará disponible en <strong>todas</strong>.</p>
              <div className="grid grid-cols-2 gap-2">
                {branches.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.branch_ids.includes(b.id)}
                      onCheckedChange={(c) => toggleBranch(b.id, c === true)}
                    />
                    {b.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingId ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
