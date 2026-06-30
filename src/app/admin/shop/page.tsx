'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Home, ShoppingCart, CalendarOff, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Branch { id: string; name: string }
interface StripeProduct { id: string; name: string; product_type: string }
interface Restriction {
  id: string
  stripe_product_id: string
  product_name: string | null
  branch_id: string | null
  restriction_type: 'allowed_weekdays' | 'blocked_dates' | 'blocked_date_range'
  allowed_weekdays: number[] | null
  blocked_dates: string[] | null
  start_date: string | null
  end_date: string | null
  note: string | null
  is_active: boolean
  created_at: string
}

const WEEKDAYS = [
  { label: 'Dom', value: 0 }, { label: 'Lun', value: 1 }, { label: 'Mar', value: 2 },
  { label: 'Mié', value: 3 }, { label: 'Jue', value: 4 }, { label: 'Vie', value: 5 },
  { label: 'Sáb', value: 6 },
]

const TYPE_LABELS: Record<string, string> = {
  allowed_weekdays: 'Solo ciertos días',
  blocked_dates: 'Fechas bloqueadas',
  blocked_date_range: 'Rango bloqueado',
}

export default function AdminShopPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [restrictions, setRestrictions] = useState<Restriction[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [products, setProducts] = useState<StripeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formProductId, setFormProductId] = useState('')
  const [formProductName, setFormProductName] = useState('')
  const [formBranchId, setFormBranchId] = useState('all')
  const [formType, setFormType] = useState<'allowed_weekdays' | 'blocked_dates' | 'blocked_date_range'>('allowed_weekdays')
  const [formWeekdays, setFormWeekdays] = useState<number[]>([])
  const [formBlockedDates, setFormBlockedDates] = useState('')
  const [formStartDate, setFormStartDate] = useState('')
  const [formEndDate, setFormEndDate] = useState('')
  const [formNote, setFormNote] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/admin/login')
    })
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [{ data: branchData }, { data: restrictionData }] = await Promise.all([
      supabase.from('branches').select('id, name').eq('is_active', true).order('name'),
      supabase.from('shop_date_restrictions').select('*').order('created_at', { ascending: false }),
    ])
    setBranches(branchData ?? [])
    setRestrictions(restrictionData ?? [])
    setLoading(false)
  }

  const loadProductsForBranch = useCallback(async (branchId: string) => {
    setLoadingProducts(true)
    const url = branchId === 'all' ? '/api/stripe/products' : `/api/stripe/products?branch_id=${branchId}`
    const res = await fetch(url)
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
    setLoadingProducts(false)
  }, [])

  const handleBranchChange = (value: string) => {
    setFormBranchId(value)
    setFormProductId('')
    setFormProductName('')
    loadProductsForBranch(value)
  }

  const handleProductChange = (value: string) => {
    setFormProductId(value)
    const p = products.find((p) => p.id === value)
    setFormProductName(p?.name ?? '')
  }

  const toggleWeekday = (day: number) => {
    setFormWeekdays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day])
  }

  const resetForm = () => {
    setFormProductId(''); setFormProductName(''); setFormBranchId('all')
    setFormType('allowed_weekdays'); setFormWeekdays([]); setFormBlockedDates('')
    setFormStartDate(''); setFormEndDate(''); setFormNote('')
  }

  const handleSave = async () => {
    if (!formProductId) { toast.error('Selecciona un producto'); return }
    if (formType === 'allowed_weekdays' && formWeekdays.length === 0) { toast.error('Selecciona al menos un día permitido'); return }
    if (formType === 'blocked_dates' && !formBlockedDates.trim()) { toast.error('Ingresa al menos una fecha'); return }
    if (formType === 'blocked_date_range' && (!formStartDate || !formEndDate)) { toast.error('Ingresa fecha inicio y fin'); return }

    setSaving(true)
    const payload: any = {
      stripe_product_id: formProductId,
      product_name: formProductName,
      branch_id: formBranchId === 'all' ? null : formBranchId,
      restriction_type: formType,
      allowed_weekdays: formType === 'allowed_weekdays' ? formWeekdays : null,
      blocked_dates: formType === 'blocked_dates'
        ? formBlockedDates.split(',').map((d) => d.trim()).filter(Boolean)
        : null,
      start_date: formType === 'blocked_date_range' ? formStartDate : null,
      end_date: formType === 'blocked_date_range' ? formEndDate : null,
      note: formNote || null,
      is_active: true,
    }

    const { error } = await supabase.from('shop_date_restrictions').insert(payload)
    if (error) {
      toast.error('Error al guardar: ' + error.message)
    } else {
      toast.success('Restricción creada correctamente')
      setOpen(false)
      resetForm()
      fetchData()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta restricción?')) return
    const { error } = await supabase.from('shop_date_restrictions').delete().eq('id', id)
    if (error) { toast.error('Error al eliminar'); return }
    toast.success('Restricción eliminada')
    setRestrictions((prev) => prev.filter((r) => r.id !== id))
  }

  const handleToggleActive = async (r: Restriction) => {
    const { error } = await supabase.from('shop_date_restrictions').update({ is_active: !r.is_active }).eq('id', r.id)
    if (error) { toast.error('Error al actualizar'); return }
    setRestrictions((prev) => prev.map((x) => x.id === r.id ? { ...x, is_active: !x.is_active } : x))
  }

  const getBranchName = (id: string | null) => {
    if (!id) return 'Todas'
    return branches.find((b) => b.id === id)?.name ?? id
  }

  const formatRestrictionDetail = (r: Restriction) => {
    if (r.restriction_type === 'allowed_weekdays') {
      const days = (r.allowed_weekdays ?? []).map((d) => WEEKDAYS.find((w) => w.value === d)?.label ?? d).join(', ')
      return `Solo: ${days}`
    }
    if (r.restriction_type === 'blocked_dates') {
      return `${(r.blocked_dates ?? []).length} fecha(s) bloqueada(s)`
    }
    if (r.restriction_type === 'blocked_date_range') {
      return `${r.start_date} → ${r.end_date}`
    }
    return ''
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm"><Home className="h-4 w-4 mr-1" /> Admin</Button>
            </Link>
            <span className="text-gray-400">/</span>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              <h1 className="text-xl font-bold font-headline">Shop — Control de fechas</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refrescar
            </Button>
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => loadProductsForBranch('all')}>
                  <Plus className="h-4 w-4 mr-1" /> Nueva restricción
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CalendarOff className="h-5 w-5 text-orange-500" /> Agregar restricción de fechas
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Branch filter */}
                  <div className="space-y-1">
                    <Label>Sucursal (para filtrar productos)</Label>
                    <Select value={formBranchId} onValueChange={handleBranchChange}>
                      <SelectTrigger><SelectValue placeholder="Selecciona sucursal..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las sucursales</SelectItem>
                        {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Product */}
                  <div className="space-y-1">
                    <Label>Producto de Stripe <span className="text-red-500">*</span></Label>
                    {loadingProducts ? (
                      <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Cargando productos...
                      </div>
                    ) : (
                      <Select value={formProductId} onValueChange={handleProductChange}>
                        <SelectTrigger><SelectValue placeholder="Selecciona producto..." /></SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name} ({p.product_type})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Type */}
                  <div className="space-y-1">
                    <Label>Tipo de restricción <span className="text-red-500">*</span></Label>
                    <Select value={formType} onValueChange={(v) => setFormType(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allowed_weekdays">Solo ciertos días de la semana</SelectItem>
                        <SelectItem value="blocked_dates">Bloquear fechas específicas</SelectItem>
                        <SelectItem value="blocked_date_range">Bloquear rango de fechas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weekdays */}
                  {formType === 'allowed_weekdays' && (
                    <div className="space-y-2">
                      <Label>Días permitidos (los demás se bloquean)</Label>
                      <div className="flex gap-2 flex-wrap">
                        {WEEKDAYS.map((d) => (
                          <label key={d.value} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-colors
                            ${formWeekdays.includes(d.value) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 hover:border-orange-300'}`}>
                            <Checkbox
                              checked={formWeekdays.includes(d.value)}
                              onCheckedChange={() => toggleWeekday(d.value)}
                              className="hidden"
                            />
                            {d.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blocked dates */}
                  {formType === 'blocked_dates' && (
                    <div className="space-y-1">
                      <Label>Fechas a bloquear (separadas por coma)</Label>
                      <Input
                        placeholder="2026-07-04, 2026-07-05, 2026-12-25"
                        value={formBlockedDates}
                        onChange={(e) => setFormBlockedDates(e.target.value)}
                      />
                      <p className="text-xs text-gray-400">Formato: AAAA-MM-DD</p>
                    </div>
                  )}

                  {/* Date range */}
                  {formType === 'blocked_date_range' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Fecha inicio</Label>
                        <Input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label>Fecha fin</Label>
                        <Input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  <div className="space-y-1">
                    <Label>Nota (opcional)</Label>
                    <Input placeholder="Ej: Promo solo aplica lunes, Vacaciones de verano..." value={formNote} onChange={(e) => setFormNote(e.target.value)} />
                  </div>

                  <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...</> : 'Guardar restricción'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats card */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Restricciones configuradas</CardTitle>
            <CardDescription>
              Controla en qué fechas están disponibles los accesos y promociones de tu tienda.
              Las restricciones activas bloquean o limitan la selección de fecha al momento de comprar.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
            ) : restrictions.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <CalendarOff className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No hay restricciones configuradas.</p>
                <p className="text-sm mt-1">Agrega una para controlar la disponibilidad de fechas en el shop.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restrictions.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.product_name ?? r.stripe_product_id}</TableCell>
                      <TableCell>{getBranchName(r.branch_id)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{TYPE_LABELS[r.restriction_type]}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{formatRestrictionDetail(r)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{r.note ?? '—'}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleActive(r)}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer
                            ${r.is_active ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'}`}
                        >
                          {r.is_active ? 'Activa' : 'Inactiva'}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(r.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
