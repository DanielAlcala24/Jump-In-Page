// Enlaces configurables desde el admin (popup): a dónde lleva una imagen al darle clic.
//   /ruta            página del sitio
//   #seccion         sección de la página actual (el popup solo sale en el inicio)
//   /ruta#seccion    sección de otra página
//   https://...      sitio externo (se abre en otra pestaña)

export const esEnlaceExterno = (enlace: string) => /^https?:\/\//i.test(enlace)

export const esEnlaceASeccion = (enlace: string) => enlace.startsWith('#')

// Devuelve el mensaje de error, o null si el enlace es válido (vacío = sin enlace).
export function validarEnlace(enlace: string): string | null {
  const e = enlace.trim()
  if (!e) return null
  if (/\s/.test(e)) return 'El enlace no puede tener espacios'
  if (e.startsWith('//')) return 'El enlace debe empezar con "/", "#" o "https://"'
  if (esEnlaceASeccion(e)) return e.length > 1 ? null : 'Escribe el nombre de la sección después del "#"'
  if (e.startsWith('/') || esEnlaceExterno(e)) return null
  return 'El enlace debe empezar con "/" (página del sitio), "#" (sección del inicio) o "https://" (sitio externo)'
}

// Sugerencias para el campo de enlace del admin.
export const SUGERENCIAS_ENLACE: { valor: string; etiqueta: string }[] = [
  { valor: '/shop', etiqueta: 'Tienda en línea (compra de entradas)' },
  { valor: '/precios-y-promociones', etiqueta: 'Precios y promociones' },
  { valor: '/precios-y-promociones?tab=Promociones', etiqueta: 'Pestaña de promociones' },
  { valor: '/fiestas-y-eventos/fiestas-cumpleanos', etiqueta: 'Fiestas de cumpleaños' },
  { valor: '/fiestas-y-eventos/fiestas-cumpleanos#nuestros-paquetes', etiqueta: 'Paquetes de cumpleaños' },
  { valor: '/fiestas-y-eventos/eventos-empresariales', etiqueta: 'Eventos empresariales' },
  { valor: '/atracciones', etiqueta: 'Atracciones' },
  { valor: '/sucursales', etiqueta: 'Sucursales' },
  { valor: '/menu-alimentos', etiqueta: 'Menú de alimentos' },
  { valor: '/galeria', etiqueta: 'Galería' },
  { valor: '/blog', etiqueta: 'Blog' },
  { valor: '#introduccion', etiqueta: 'Inicio › Introducción' },
  { valor: '#eventos', etiqueta: 'Inicio › Eventos' },
  { valor: '#galeria', etiqueta: 'Inicio › Galería' },
  { valor: '#testimonios', etiqueta: 'Inicio › Testimonios' },
  { valor: '#faq', etiqueta: 'Inicio › Preguntas frecuentes' },
  { valor: '#promociones-form', etiqueta: 'Inicio › Formulario de promociones' },
]
