'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowDown, ArrowUp, ListOrdered, Loader2, Package, Tag, Ticket } from 'lucide-react'
import { toast } from 'sonner'
import { createClientComponentClient } from '@/lib/supabase'
import { usePuedeEditar } from '@/components/admin/admin-access'
import {
  ETIQUETA_TIPO_PLURAL,
  ORDEN_SECCIONES_DEFAULT,
  normalizarOrden,
  type TipoProducto,
} from '@/lib/shop-secciones'

const ICONOS: Record<TipoProducto, typeof Ticket> = { access: Ticket, promotion: Tag, article: Package }

// Botón + ventana para elegir el orden de las secciones (Accesos / Promociones /
// Artículos) del paso "Productos" de /shop. Se guarda en shop_settings.section_order.
export function OrdenSeccionesShop() {
  const supabase = createClientComponentClient()
  const puedeEditar = usePuedeEditar()
  const [open, setOpen] = useState(false)
  const [orden, setOrden] = useState<TipoProducto[]>(ORDEN_SECCIONES_DEFAULT)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [faltaTabla, setFaltaTabla] = useState(false)

  const abrir = async () => {
    setOpen(true)
    setCargando(true)
    setFaltaTabla(false)
    const { data, error } = await supabase.from('shop_settings').select('section_order').eq('id', 1).maybeSingle()
    if (error) {
      // Lo más común: todavía no se corre supabase-shop-settings.sql.
      setFaltaTabla(true)
      setOrden(ORDEN_SECCIONES_DEFAULT)
    } else {
      setOrden(normalizarOrden(data?.section_order))
    }
    setCargando(false)
  }

  const mover = (index: number, delta: -1 | 1) => {
    setOrden((prev) => {
      const destino = index + delta
      if (destino < 0 || destino >= prev.length) return prev
      const nuevo = [...prev]
      ;[nuevo[index], nuevo[destino]] = [nuevo[destino], nuevo[index]]
      return nuevo
    })
  }

  const guardar = async () => {
    setGuardando(true)
    const { error } = await supabase
      .from('shop_settings')
      .upsert({ id: 1, section_order: orden, updated_at: new Date().toISOString() })
    setGuardando(false)
    if (error) {
      toast.error('No se pudo guardar el orden: ' + error.message)
      return
    }
    toast.success('Orden de las secciones guardado')
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" onClick={abrir}>
        <ListOrdered className="h-4 w-4 mr-2" /> Orden en /shop
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-orange-500" /> Orden de las secciones en /shop
            </DialogTitle>
            <DialogDescription>
              Así se acomodan las secciones en el paso de productos de la tienda (de arriba hacia abajo).
              Una sección sin productos en la sucursal elegida no se muestra.
            </DialogDescription>
          </DialogHeader>

          {cargando ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-orange-500" /></div>
          ) : faltaTabla ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              Falta crear la tabla de ajustes: corre <code>supabase-shop-settings.sql</code> en el SQL Editor
              de Supabase. Mientras tanto /shop usa el orden Accesos → Promociones → Artículos.
            </p>
          ) : (
            <ol className="space-y-2">
              {orden.map((tipo, index) => {
                const Icono = ICONOS[tipo]
                return (
                  <li key={tipo} className="flex items-center gap-3 rounded-md border bg-white p-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                      {index + 1}
                    </span>
                    <Icono className="h-4 w-4 text-orange-500" />
                    <span className="flex-1 font-medium">{ETIQUETA_TIPO_PLURAL[tipo]}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!puedeEditar || index === 0}
                      onClick={() => mover(index, -1)}
                      aria-label={`Subir ${ETIQUETA_TIPO_PLURAL[tipo]}`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!puedeEditar || index === orden.length - 1}
                      onClick={() => mover(index, 1)}
                      aria-label={`Bajar ${ETIQUETA_TIPO_PLURAL[tipo]}`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </li>
                )
              })}
            </ol>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {puedeEditar ? 'Cancelar' : 'Cerrar'}
            </Button>
            {puedeEditar && (
              <Button
                onClick={guardar}
                disabled={guardando || cargando || faltaTabla}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {guardando ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...</> : 'Guardar orden'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
