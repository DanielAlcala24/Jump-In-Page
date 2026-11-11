'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MousePointerClick } from 'lucide-react'
import { PromoButton } from '@/components/promo-button'
import { SUGERENCIAS_ENLACE } from '@/lib/enlaces'
import { validarBotonPromocion } from '@/lib/promociones'

// Campos "Botón (opcional)" de los formularios de nueva / editar promoción.
export function BotonPromocionFields({
  texto,
  enlace,
  onTextoChange,
  onEnlaceChange,
}: {
  texto: string
  enlace: string
  onTextoChange: (v: string) => void
  onEnlaceChange: (v: string) => void
}) {
  const error = validarBotonPromocion(texto, enlace)
  const completo = texto.trim() && enlace.trim() && !error

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div>
        <Label className="flex items-center gap-2 text-base font-semibold">
          <MousePointerClick className="h-4 w-4 text-orange-500" />
          Botón <span className="font-normal text-gray-500">(opcional)</span>
        </Label>
        <p className="text-xs text-gray-500">
          Agrega un botón a la tarjeta de la promoción. Puede llevar a una página del sitio
          (<code>/shop</code>), a una sección del inicio (<code>#faq</code>), a una sección de otra
          página (<code>/fiestas-y-eventos/fiestas-cumpleanos#nuestros-paquetes</code>) o a un sitio
          externo (<code>https://...</code>, se abre en otra pestaña). Deja ambos vacíos si no quieres botón.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="buttonText">Leyenda del botón</Label>
          <Input
            id="buttonText"
            placeholder="Ej: Compra aquí"
            maxLength={40}
            value={texto}
            onChange={(e) => onTextoChange(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="buttonUrl">Enlace del botón</Label>
          <Input
            id="buttonUrl"
            list="boton-promocion-sugerencias"
            placeholder="/shop  ·  #faq  ·  https://..."
            value={enlace}
            onChange={(e) => onEnlaceChange(e.target.value)}
            className={error && enlace.trim() ? 'border-red-400 focus-visible:ring-red-400' : ''}
          />
          <datalist id="boton-promocion-sugerencias">
            {SUGERENCIAS_ENLACE.map((s) => (
              <option key={s.valor} value={s.valor}>{s.etiqueta}</option>
            ))}
          </datalist>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {completo && (
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Vista previa:</p>
          {/* pointer-events-none: es solo una muestra, no debe navegar desde el admin */}
          <div className="max-w-xs pointer-events-none">
            <PromoButton promo={{ button_text: texto, button_url: enlace }} />
          </div>
        </div>
      )}
    </div>
  )
}
