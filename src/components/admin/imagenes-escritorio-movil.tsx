'use client'

import { Label } from '@/components/ui/label'
import { Monitor, Smartphone } from 'lucide-react'
import MediaSelector from '@/components/admin/media-selector'

// Dos selectores de imagen (escritorio y móvil), ambos opcionales. Se usa en los
// productos de /admin/articulos y en los grupos de /admin/articulos/grupos.
// En /shop: < 768 px se usa la de móvil; desde 768 px, la de escritorio. Si falta
// una, se usa la otra en las dos vistas.
export function ImagenesEscritorioMovil({
  escritorio,
  movil,
  onEscritorioChange,
  onMovilChange,
  ayuda,
}: {
  escritorio: string
  movil: string
  onEscritorioChange: (url: string) => void
  onMovilChange: (url: string) => void
  ayuda?: string
}) {
  return (
    <div className="space-y-2">
      <div>
        <Label className="block">Imágenes <span className="font-normal text-gray-500">(opcionales)</span></Label>
        <p className="text-xs text-gray-500">
          {ayuda ?? 'En celular se muestra la de móvil y en computadora la de escritorio. Si solo pones una, se usa en las dos vistas.'}{' '}
          Si la imagen no tiene la relación de aspecto indicada, se recorta para llenar el recuadro: deja lo importante al centro.
        </p>
      </div>
      {/* Proporciones medidas sobre las tarjetas de /shop: contenedor de 896 px
          (max-w-4xl) y recuadro de imagen de 144 px de alto (h-36); la tarjeta sola
          en su sección lleva la imagen a la izquierda en un recuadro de 2/5 del
          ancho y mínimo 256 px de alto. Si cambia ese diseño, actualizar esto. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1 rounded-md border p-2">
          <p className="flex items-center gap-1 text-xs font-medium text-gray-700">
            <Monitor className="h-3.5 w-3.5" /> Escritorio
          </p>
          <div className="text-[11px] text-gray-500 leading-snug">
            <p>Relación de aspecto según cuántas tarjetas hay en su sección:</p>
            <ul className="mt-0.5 space-y-0.5">
              <li>• 3 o más: <strong>2:1</strong> (ej. 1000 × 500 px)</li>
              <li>• 2: <strong>3:1</strong> (ej. 1200 × 400 px)</li>
              <li>• Sola en su sección: <strong>4:3</strong> (ej. 800 × 600 px)</li>
            </ul>
          </div>
          <MediaSelector value={escritorio} onSelect={onEscritorioChange} label="Elegir imagen" />
        </div>
        <div className="space-y-1 rounded-md border p-2">
          <p className="flex items-center gap-1 text-xs font-medium text-gray-700">
            <Smartphone className="h-3.5 w-3.5" /> Móvil
          </p>
          <div className="text-[11px] text-gray-500 leading-snug">
            <p>Relación de aspecto: <strong>5:2</strong> (ej. 1000 × 400 px)</p>
            <p className="text-gray-400">En celular la tarjeta siempre ocupa todo el ancho, así que es la misma en cualquier caso.</p>
          </div>
          <MediaSelector value={movil} onSelect={onMovilChange} label="Elegir imagen" />
        </div>
      </div>
    </div>
  )
}
