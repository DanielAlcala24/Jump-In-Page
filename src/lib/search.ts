import { createClientComponentClient } from './supabase'

export interface SearchResult {
  type:
    | 'page' | 'section' | 'faq' | 'blog' | 'menu'
    | 'attraction' | 'promotion' | 'branch' | 'birthday'
  title: string
  description?: string
  href: string
  sectionId?: string // Para navegación con hash (#)
  external?: boolean // Abre en otra pestaña (sistemas fuera del sitio)
}

// ---------------------------------------------------------------------------
// QUÉ SE INDEXA Y QUÉ NO
//
// Solo entra aquí contenido que YA es visible en el sitio público. Queda fuera,
// a propósito:
//   - La tabla `knowledge_base` completa (es material interno / para consumo por
//     API, nunca se muestra en el sitio).
//   - Las columnas `knowledge_base`, `knowledge_category` y `knowledge_is_active`
//     de `attractions`, `promotions`, `birthday_packages` y `menu_items`: son
//     informativas para el admin y NO se muestran al público. Por eso cada
//     consulta pide columnas explícitas y nunca `select('*')`.
//   - `leads`, `shop_orders`, `banner_config` y todo lo de `/admin`.
//   - `/shop` y `/shop/success`: la tienda todavía no está enlazada en el menú
//     ni en el pie de página, así que no se anuncia desde el buscador.
//   - Sucursales con `is_active = false`.
// ---------------------------------------------------------------------------

// Quita acentos, mayúsculas y signos para que "trampolin" encuentre "Trampolín"
// y "cumpleanos" encuentre "cumpleaños".
function normalize(text: string | null | undefined): string {
  return (text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // marcas de acento (también ñ → n)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function snippet(text: string | null | undefined, max = 110): string | undefined {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim()
  if (!clean) return undefined
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

// Páginas y secciones fijas del sitio. `keywords` no se muestra: solo sirve para
// que la gente encuentre la página como la nombra de verdad ("cuanto cuesta",
// "brincolines", "estacionamiento").
interface StaticEntry extends SearchResult {
  keywords?: string
}

const staticEntries: StaticEntry[] = [
  {
    type: 'page',
    title: 'Inicio',
    description: 'Página principal de Jump-In',
    href: '/',
    keywords: 'home principal jumpin jump in trampoline park',
  },
  {
    type: 'page',
    title: 'Atracciones',
    description: 'Conoce todas nuestras atracciones y juegos',
    href: '/atracciones',
    keywords: 'juegos trampolines brincolines albercas de esponjas actividades toboganes areas',
  },
  {
    type: 'page',
    title: 'Precios y Promociones',
    description: 'Consulta nuestros precios y promociones especiales',
    href: '/precios-y-promociones',
    keywords: 'costo cuanto cuesta tarifas precio boletos entradas descuentos ofertas martes miercoles',
  },
  {
    type: 'page',
    title: 'Promociones',
    description: 'Todas las promociones vigentes de Jump-In',
    href: '/precios-y-promociones?tab=Promociones',
    keywords: 'ofertas descuentos 2x1 promocion cupones',
  },
  {
    type: 'page',
    title: 'Fiestas de Cumpleaños',
    description: 'Celebra tu cumpleaños con nosotros: paquetes y salones',
    href: '/fiestas-y-eventos/fiestas-cumpleanos',
    keywords: 'fiesta cumple paquetes salon festejado pastel invitados reservar celebracion',
  },
  {
    type: 'page',
    title: 'Eventos Empresariales',
    description: 'Organiza tu evento corporativo o de integración con nosotros',
    href: '/fiestas-y-eventos/eventos-empresariales',
    keywords: 'empresas corporativo teambuilding integracion escolares grupos convivencia',
  },
  {
    type: 'page',
    title: 'Menú de Alimentos',
    description: 'Nuestro menú completo de alimentos y bebidas',
    href: '/menu-alimentos',
    keywords: 'comida bebidas snacks pizza hamburguesa papas refresco cafeteria restaurante',
  },
  {
    type: 'page',
    title: 'Sucursales',
    description: 'Encuentra la sucursal de Jump-In más cercana',
    href: '/sucursales',
    keywords: 'ubicacion direccion donde estamos horarios telefono mapa como llegar parques',
  },
  {
    type: 'page',
    title: 'Galería',
    description: 'Fotos y videos de Jump-In',
    href: '/galeria',
    keywords: 'fotos imagenes videos album',
  },
  {
    type: 'page',
    title: 'Blog',
    description: 'Noticias, tips y novedades de Jump-In',
    href: '/blog',
    keywords: 'articulos noticias consejos novedades',
  },
  {
    type: 'page',
    title: 'Facturación',
    description: 'Solicita tu factura electrónica',
    href: '/facturacion',
    keywords: 'factura facturas cfdi rfc comprobante fiscal ticket',
  },
  {
    type: 'page',
    title: 'Compromiso Social',
    description: 'Nuestro compromiso con la comunidad',
    href: '/compromiso-social',
    keywords: 'responsabilidad social causas apoyo comunidad donaciones inclusion',
  },
  {
    type: 'page',
    title: 'Jump-In × Casa Fútbol',
    description: 'Colaboración de Jump-In con Casa Fútbol',
    href: '/casafutbol',
    keywords: 'casa futbol soccer colaboracion alianza',
  },
  {
    type: 'page',
    title: 'Aviso de Privacidad',
    description: 'Cómo tratamos y protegemos tus datos personales',
    href: '/aviso-de-privacidad',
    keywords: 'privacidad datos personales proteccion legal arco',
  },
  {
    type: 'page',
    title: 'Términos y Condiciones',
    description: 'Términos y condiciones de uso',
    href: '/terminos-y-condiciones',
    keywords: 'terminos condiciones legal reglas politicas',
  },
  {
    type: 'page',
    title: 'Preguntas Frecuentes',
    description: 'Respuestas a las dudas más comunes',
    href: '/#faq',
    sectionId: 'faq',
    keywords: 'faq dudas preguntas ayuda requisitos calcetines edad reglamento',
  },
  {
    type: 'page',
    title: 'Registro Digital (responsiva)',
    description: 'Llena tu responsiva en línea y evita filas al llegar',
    href: 'https://databiz.mx:300/Jump-in_Waiver/registroResponsable.aspx',
    external: true,
    keywords: 'responsiva registro carta firma waiver anticipado filas menores tutor',
  },
  {
    type: 'section',
    title: 'Quiénes Somos',
    description: 'Jump-In, el primer trampoline park de México',
    href: '/nosotros',
    sectionId: 'about',
    keywords: 'nosotros historia empresa quienes somos acerca de',
  },
  {
    type: 'section',
    title: 'Misión',
    description: 'Nuestra misión es crear momentos inolvidables de felicidad',
    href: '/nosotros',
    sectionId: 'about',
    keywords: 'mision proposito valores',
  },
  {
    type: 'section',
    title: 'Visión',
    description: 'Seguir siendo el 1er Trampoline Park de México',
    href: '/nosotros',
    sectionId: 'about',
    keywords: 'vision futuro objetivo',
  },
  {
    type: 'section',
    title: 'Bongo y Maya',
    description: 'Conoce a las mascotas de Jump-In',
    href: '/nosotros',
    sectionId: 'about',
    keywords: 'mascotas bongo maya personajes botargas',
  },
]

// Una entrada ya lista para puntuar: el resultado que se muestra, más el texto
// contra el que se compara la búsqueda.
interface IndexEntry {
  result: SearchResult
  title: string // normalizado
  body: string // normalizado (descripción + palabras clave)
}

function toEntry(result: SearchResult, extraText = ''): IndexEntry {
  return {
    result,
    title: normalize(result.title),
    body: normalize(`${result.description ?? ''} ${extraText}`),
  }
}

// El índice se arma una vez y se reutiliza: el buscador corre en cada tecla y no
// tiene caso volver a bajar las mismas tablas.
let indexCache: { at: number; entries: IndexEntry[] } | null = null
const CACHE_TTL_MS = 5 * 60 * 1000
const ROW_LIMIT = 300

async function buildIndex(): Promise<IndexEntry[]> {
  const supabase = createClientComponentClient()
  const entries: IndexEntry[] = staticEntries.map((e) => {
    const { keywords, ...result } = e
    return toEntry(result, keywords ?? '')
  })

  // Cada tabla va por separado: si una falla, el resto de la búsqueda sigue
  // funcionando en lugar de quedarse sin resultados.
  const sources: Array<() => Promise<IndexEntry[]>> = [
    // Preguntas frecuentes
    async () => {
      const { data } = await supabase
        .from('faqs')
        .select('id, question, answer')
        .limit(ROW_LIMIT)
      return (data ?? []).map((faq: any) =>
        toEntry(
          {
            type: 'faq',
            title: faq.question,
            description: snippet(faq.answer),
            href: '/#faq',
            sectionId: 'faq',
          },
          faq.answer ?? ''
        )
      )
    },

    // Artículos del blog
    async () => {
      const { data } = await supabase
        .from('posts')
        .select('title, description, slug')
        .limit(ROW_LIMIT)
      return (data ?? []).map((post: any) =>
        toEntry({
          type: 'blog',
          title: post.title,
          description: snippet(post.description),
          href: `/blog/${post.slug}`,
        })
      )
    },

    // Menú de alimentos
    async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('title, description, category, price')
        .limit(ROW_LIMIT)
      return (data ?? []).map((item: any) =>
        toEntry(
          {
            type: 'menu',
            title: item.title,
            description: snippet(
              [item.category, item.price, item.description].filter(Boolean).join(' · ')
            ),
            href: '/menu-alimentos',
            sectionId: 'menu',
          },
          `${item.category ?? ''} ${item.description ?? ''}`
        )
      )
    },

    // Atracciones
    async () => {
      const { data } = await supabase
        .from('attractions')
        .select('name, description, category')
        .limit(ROW_LIMIT)
      return (data ?? []).map((a: any) =>
        toEntry(
          {
            type: 'attraction',
            title: a.name,
            description: snippet(a.description ?? a.category),
            href: '/atracciones',
          },
          `${a.category ?? ''} ${a.description ?? ''}`
        )
      )
    },

    // Promociones
    async () => {
      const { data } = await supabase
        .from('promotions')
        .select('title, description, available_in')
        .limit(ROW_LIMIT)
      return (data ?? []).map((p: any) =>
        toEntry(
          {
            type: 'promotion',
            title: p.title,
            description: snippet(p.description),
            href: '/precios-y-promociones?tab=Promociones',
          },
          `promocion oferta descuento ${(p.available_in ?? []).join(' ')}`
        )
      )
    },

    // Paquetes de cumpleaños
    async () => {
      const { data } = await supabase
        .from('birthday_packages')
        .select('title, description, price')
        .limit(ROW_LIMIT)
      return (data ?? []).map((p: any) =>
        toEntry(
          {
            type: 'birthday',
            title: p.title,
            description: snippet(
              [p.price, p.description].filter(Boolean).join(' · ')
            ),
            href: '/fiestas-y-eventos/fiestas-cumpleanos',
          },
          'paquete fiesta cumpleanos'
        )
      )
    },

    // Sucursales activas (cada una con su propia página)
    async () => {
      const { data } = await supabase
        .from('branches')
        .select('name, slug, state, address, is_active')
        .eq('is_active', true)
        .limit(ROW_LIMIT)
      return (data ?? []).map((b: any) =>
        toEntry(
          {
            type: 'branch',
            title: b.name,
            description: snippet([b.state, b.address].filter(Boolean).join(' · ')),
            href: `/sucursales/${b.slug}`,
          },
          `sucursal parque ${b.state ?? ''} ${b.address ?? ''}`
        )
      )
    },
  ]

  const settled = await Promise.allSettled(sources.map((fn) => fn()))
  settled.forEach((r) => {
    if (r.status === 'fulfilled') entries.push(...r.value)
    else console.error('Error indexando contenido para el buscador:', r.reason)
  })

  return entries
}

async function getIndex(): Promise<IndexEntry[]> {
  if (indexCache && Date.now() - indexCache.at < CACHE_TTL_MS) {
    return indexCache.entries
  }
  const entries = await buildIndex()
  indexCache = { at: Date.now(), entries }
  return entries
}

// Puntúa una entrada contra las palabras buscadas. Devuelve 0 si le falta
// alguna: así "pizza infantil" no trae todo lo que diga solo "infantil".
function scoreEntry(entry: IndexEntry, tokens: string[]): number {
  const haystack = `${entry.title} ${entry.body}`
  let score = 0

  for (const token of tokens) {
    if (!haystack.includes(token)) {
      // Las palabras cortas ("de", "la", "y") no son obligatorias: si faltan,
      // simplemente no suman, en vez de descartar un resultado bueno.
      if (token.length >= 3) return 0
      continue
    }

    if (entry.title === token) score += 100
    else if (entry.title.startsWith(`${token} `)) score += 60
    else if (entry.title.includes(` ${token} `) || entry.title.endsWith(` ${token}`)) score += 45
    else if (entry.title.includes(token)) score += 25
    else if (entry.body.includes(` ${token} `) || entry.body.startsWith(`${token} `)) score += 10
    else score += 4
  }

  return score
}

// Con pocas letras conviene priorizar páginas y secciones sobre, por ejemplo, un
// platillo del menú que casualmente contenga esas letras.
const TYPE_BONUS: Record<SearchResult['type'], number> = {
  page: 12,
  section: 10,
  branch: 8,
  faq: 6,
  promotion: 5,
  attraction: 5,
  birthday: 4,
  menu: 3,
  blog: 2,
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  const normalized = normalize(query)
  if (normalized.length < 2) return []

  const tokens = normalized.split(' ').filter(Boolean)
  if (tokens.length === 0) return []

  let index: IndexEntry[]
  try {
    index = await getIndex()
  } catch (error) {
    console.error('Error construyendo el índice de búsqueda:', error)
    return []
  }

  const scored = index
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) + TYPE_BONUS[entry.result.type] }))
    .filter(({ entry, score }) => score > TYPE_BONUS[entry.result.type])
    .sort((a, b) => b.score - a.score || a.entry.result.title.localeCompare(b.entry.result.title, 'es'))

  // Quita repetidos (p. ej. una promoción que también es página fija).
  const seen = new Set<string>()
  const results: SearchResult[] = []
  for (const { entry } of scored) {
    const key = `${entry.result.href}|${normalize(entry.result.title)}`
    if (seen.has(key)) continue
    seen.add(key)
    results.push(entry.result)
    if (results.length >= 10) break
  }

  return results
}
