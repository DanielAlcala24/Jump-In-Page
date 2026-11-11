import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { esEnlaceExterno } from '@/lib/enlaces'
import { botonDePromocion, type PromocionPublica } from '@/lib/promociones'

// Botón opcional de una promoción (button_text + button_url). No pinta nada si la
// promoción no tiene botón o si el enlace no es válido.
export function PromoButton({
  promo,
  className,
}: {
  promo: Pick<PromocionPublica, 'button_text' | 'button_url'>
  className?: string
}) {
  const boton = botonDePromocion(promo)
  if (!boton) return null

  const externo = esEnlaceExterno(boton.enlace)
  const clases = cn(
    'w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 font-semibold',
    className
  )
  const contenido = (
    <>
      {boton.texto}
      {externo ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
    </>
  )

  return externo ? (
    <a href={boton.enlace} target="_blank" rel="noopener noreferrer" className={clases}>
      {contenido}
    </a>
  ) : (
    <Link href={boton.enlace} className={clases}>
      {contenido}
    </Link>
  )
}
