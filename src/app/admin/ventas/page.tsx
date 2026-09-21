'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Download,
  Calendar as CalendarIcon,
  FilterX,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronRight,
  DollarSign,
  ShoppingCart,
  Ticket,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

interface OrderItem {
  description: string | null
  quantity: number | null
  amount_total: number | null // en centavos
}

interface ShopOrder {
  id: string
  stripe_session_id: string
  id_ticket: string | null
  branch_id: string | null
  branch_name: string
  customer_email: string
  visit_date: string | null
  items: OrderItem[] | null
  amount_total: number | null // en centavos
  currency: string | null
  status: string | null
  created_at: string
}

const money = (centavos: number | null | undefined) =>
  ((centavos ?? 0) / 100).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
  })

// 'YYYY-MM-DD' se formatea a mano: new Date('2026-09-20') se interpreta como UTC
// y en México se vería un día antes.
const fechaVisita = (iso: string | null) => {
  if (!iso) return '---'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const fechaCompra = (iso: string) =>
  new Date(iso).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const piezas = (order: ShopOrder) =>
  (order.items ?? []).reduce((acc, item) => acc + (item.quantity ?? 0), 0)

export default function VentasPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<ShopOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [branch, setBranch] = useState('')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin/login')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [supabase, router])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.set('from', startDate)
      if (endDate) params.set('to', endDate)

      const res = await fetch(`/api/admin/shop-orders?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al cargar las ventas')

      setOrders(data)
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      toast.error(err.message || 'Error al cargar las ventas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, startDate, endDate])

  const sucursales = useMemo(
    () => Array.from(new Set(orders.map((o) => o.branch_name).filter(Boolean))).sort(),
    [orders]
  )

  // Sucursal y búsqueda se filtran en el cliente; el rango de fechas lo aplica la API.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((o) => {
      if (branch && o.branch_name !== branch) return false
      if (!q) return true
      return (
        o.customer_email?.toLowerCase().includes(q) ||
        o.id_ticket?.toLowerCase().includes(q) ||
        o.stripe_session_id?.toLowerCase().includes(q) ||
        (o.items ?? []).some((i) => i.description?.toLowerCase().includes(q))
      )
    })
  }, [orders, branch, search])

  const stats = useMemo(() => {
    const ingresos = filtered.reduce((acc, o) => acc + (o.amount_total ?? 0), 0)
    const articulos = filtered.reduce((acc, o) => acc + piezas(o), 0)
    const clientes = new Set(filtered.map((o) => o.customer_email).filter(Boolean)).size
    return {
      ventas: filtered.length,
      ingresos,
      articulos,
      clientes,
      promedio: filtered.length ? ingresos / filtered.length : 0,
    }
  }, [filtered])

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setBranch('')
    setSearch('')
  }

  const downloadCSV = () => {
    if (filtered.length === 0) {
      toast.error('No hay ventas para descargar con los filtros actuales')
      return
    }

    const headers = [
      'Fecha de compra',
      'No. de ticket',
      'Sucursal',
      'Cliente',
      'Fecha de visita',
      'Productos',
      'Piezas',
      'Total',
      'Estado',
      'Stripe Session',
    ]

    const rows = filtered.map((o) => [
      fechaCompra(o.created_at),
      o.id_ticket ?? '',
      o.branch_name ?? '',
      o.customer_email ?? '',
      o.visit_date ?? '',
      (o.items ?? []).map((i) => `${i.quantity ?? 0} x ${i.description ?? ''}`).join(' | '),
      String(piezas(o)),
      ((o.amount_total ?? 0) / 100).toFixed(2),
      o.status ?? '',
      o.stripe_session_id ?? '',
    ])

    const csv = [headers, ...rows]
      .map((fila) => fila.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    // BOM para que Excel abra bien los acentos.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const rango = startDate || endDate ? `_${startDate || 'inicio'}_a_${endDate || 'fin'}` : ''
    link.setAttribute('download', `ventas-online${rango}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Volver al Panel
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Ventas en Línea</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={fetchOrders} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button
                onClick={downloadCSV}
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar CSV ({filtered.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Resumen */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{money(stats.ingresos)}</div>
                <p className="text-xs text-muted-foreground">
                  ticket promedio {money(stats.promedio)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.ventas}</div>
                <p className="text-xs text-muted-foreground">órdenes pagadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Artículos</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.articulos}</div>
                <p className="text-xs text-muted-foreground">piezas vendidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.clientes}</div>
                <p className="text-xs text-muted-foreground">correos distintos</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-orange-500" />
                Filtros
              </CardTitle>
              <CardDescription>
                El rango aplica sobre la fecha de compra. Los totales de arriba se calculan
                con lo que quede filtrado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-[180px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-[180px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Sucursal</Label>
                  <select
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Todas las sucursales</option>
                    {sucursales.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 flex-1 min-w-[220px]">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Correo, no. de ticket o producto"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                {(startDate || endDate || branch || search) && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FilterX className="mr-2 h-4 w-4" />
                    Limpiar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabla */}
          <Card>
            <CardHeader>
              <CardTitle>Órdenes</CardTitle>
              <CardDescription>
                Mostrando <strong>{filtered.length}</strong> de {orders.length} ventas
                registradas. Haz clic en una fila para ver el detalle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4" />
                  <p className="text-gray-500">Cargando ventas...</p>
                </div>
              ) : filtered.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8" />
                        <TableHead>Fecha compra</TableHead>
                        <TableHead>Sucursal</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Visita</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((o) => (
                        <Fragment key={o.id}>
                          <TableRow
                            className="cursor-pointer"
                            onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                          >
                            <TableCell>
                              {expanded === o.id ? (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              )}
                            </TableCell>
                            <TableCell className="text-xs whitespace-nowrap">
                              {fechaCompra(o.created_at)}
                            </TableCell>
                            <TableCell className="font-medium">{o.branch_name || '---'}</TableCell>
                            <TableCell className="text-sm">{o.customer_email || '---'}</TableCell>
                            <TableCell className="text-sm whitespace-nowrap">
                              {fechaVisita(o.visit_date)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {(o.items ?? [])
                                .map((i) => `${i.quantity ?? 0} × ${i.description ?? ''}`)
                                .join(', ') || '---'}
                            </TableCell>
                            <TableCell className="text-right font-semibold whitespace-nowrap">
                              {money(o.amount_total)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={o.status === 'completed' ? 'default' : 'secondary'}
                                className={
                                  o.status === 'completed'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : ''
                                }
                              >
                                {o.status === 'completed' ? 'Pagada' : o.status || '---'}
                              </Badge>
                            </TableCell>
                          </TableRow>

                          {expanded === o.id && (
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                              <TableCell />
                              <TableCell colSpan={7} className="py-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <span className="text-gray-500">No. de ticket:</span>{' '}
                                      <span className="font-mono">{o.id_ticket || 'sin ticket'}</span>
                                    </p>
                                    <p>
                                      <span className="text-gray-500">Sesión de Stripe:</span>{' '}
                                      <span className="font-mono text-xs break-all">
                                        {o.stripe_session_id}
                                      </span>
                                    </p>
                                    <p>
                                      <span className="text-gray-500">Moneda:</span>{' '}
                                      {(o.currency || 'mxn').toUpperCase()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 mb-2">Artículos</p>
                                    <table className="w-full text-sm">
                                      <tbody>
                                        {(o.items ?? []).map((i, idx) => (
                                          <tr key={idx} className="border-b last:border-0">
                                            <td className="py-1">{i.description ?? '---'}</td>
                                            <td className="py-1 text-center w-16">
                                              × {i.quantity ?? 0}
                                            </td>
                                            <td className="py-1 text-right w-24">
                                              {money(i.amount_total)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No se encontraron ventas con los filtros actuales.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
