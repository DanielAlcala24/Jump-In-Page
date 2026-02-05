import { createClientComponentClient } from './supabase'

export interface SearchResult {
  type: 'page' | 'section' | 'faq' | 'blog' | 'menu'
  title: string
  description?: string
  href: string
  sectionId?: string // Para navegación con hash (#)
}

// Secciones estáticas del sitio con sus IDs y palabras clave
const staticSections: SearchResult[] = [
  {
    type: 'section',
    title: 'Misión',
    description: 'Nuestra misión es crear momentos inolvidables de felicidad',
    href: '/nosotros',
    sectionId: 'about'
  },
  {
    type: 'section',
    title: 'Visión',
    description: 'Seguir siendo el 1er Trampoline Park de México',
    href: '/nosotros',
    sectionId: 'about'
  },
  {
    type: 'section',
    title: 'Quiénes Somos',
    description: 'Jump-In, el primer trampoline park de México',
    href: '/nosotros',
    sectionId: 'about'
  },
  {
    type: 'section',
    title: 'Nosotros',
    description: 'Conoce más sobre Jump-In',
    href: '/nosotros',
    sectionId: 'about'
  },
  {
    type: 'page',
    title: 'Preguntas Frecuentes',
    description: 'Encuentra respuestas a las consultas más comunes',
    href: '/#faq',
    sectionId: 'faq'
  },
  {
    type: 'page',
    title: 'Menú de Alimentos',
    description: 'Nuestro menú completo de alimentos y bebidas',
    href: '/menu-alimentos',
    sectionId: 'menu'
  },
  {
    type: 'page',
    title: 'Blog',
    description: 'Noticias, tips y más',
    href: '/blog'
  },
  {
    type: 'page',
    title: 'Atracciones',
    description: 'Conoce todas nuestras atracciones',
    href: '/atracciones'
  },
  {
    type: 'page',
    title: 'Sucursales',
    description: 'Encuentra la sucursal más cercana',
    href: '/sucursales'
  },
  {
    type: 'page',
    title: 'Precios y Promociones',
    description: 'Consulta nuestros precios y promociones especiales',
    href: '/precios-y-promociones'
  },
  {
    type: 'page',
    title: 'Compromiso Social',
    description: 'Nuestro compromiso con la comunidad',
    href: '/compromiso-social'
  },
  {
    type: 'page',
    title: 'Galería',
    description: 'Galería de fotos de Jump-In',
    href: '/galeria'
  },
  {
    type: 'page',
    title: 'Fiestas de Cumpleaños',
    description: 'Celebra tu cumpleaños con nosotros en Jump-In',
    href: '/fiestas-y-eventos/fiestas-cumpleanos'
  },
  {
    type: 'page',
    title: 'Eventos Empresariales',
    description: 'Organiza tu evento corporativo o de teambuilding con nosotros',
    href: '/fiestas-y-eventos/eventos-empresariales'
  }
]

export async function searchContent(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  const searchTerm = query.toLowerCase().trim()
  const results: SearchResult[] = []

  // 1. Buscar en secciones estáticas
  staticSections.forEach(section => {
    const titleMatch = section.title.toLowerCase().includes(searchTerm)
    const descMatch = section.description?.toLowerCase().includes(searchTerm)

    if (titleMatch || descMatch) {
      results.push(section)
    }
  })

  // 2. Buscar en FAQs de Supabase
  try {
    const supabase = createClientComponentClient()
    const { data: faqs } = await supabase
      .from('faqs')
      .select('question, answer, id')
      .or(`question.ilike.%${searchTerm}%,answer.ilike.%${searchTerm}%`)
      .limit(5)

    if (faqs) {
      faqs.forEach(faq => {
        results.push({
          type: 'faq',
          title: faq.question,
          description: faq.answer.substring(0, 100) + '...',
          href: '/#faq',
          sectionId: 'faq'
        })
      })
    }
  } catch (error) {
    console.error('Error searching FAQs:', error)
  }

  // 3. Buscar en posts del blog
  try {
    const supabase = createClientComponentClient()
    const { data: posts } = await supabase
      .from('posts')
      .select('title, description, slug')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(5)

    if (posts) {
      posts.forEach(post => {
        results.push({
          type: 'blog',
          title: post.title,
          description: post.description,
          href: `/blog/${post.slug}`
        })
      })
    }
  } catch (error) {
    console.error('Error searching blog posts:', error)
  }

  // 4. Buscar en menú de alimentos
  try {
    const supabase = createClientComponentClient()
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('title, description, category')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .limit(5)

    if (menuItems) {
      menuItems.forEach(item => {
        results.push({
          type: 'menu',
          title: item.title,
          description: `${item.category} - ${item.description?.substring(0, 80)}...`,
          href: '/menu-alimentos',
          sectionId: 'menu'
        })
      })
    }
  } catch (error) {
    console.error('Error searching menu items:', error)
  }

  // Ordenar resultados por relevancia (títulos primero, luego descripciones)
  results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(searchTerm)
    const bTitleMatch = b.title.toLowerCase().includes(searchTerm)

    if (aTitleMatch && !bTitleMatch) return -1
    if (!aTitleMatch && bTitleMatch) return 1

    return 0
  })

  return results.slice(0, 10) // Limitar a 10 resultados
}

