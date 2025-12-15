import { createServerComponentClient } from '@/lib/supabase-server'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import MenuPostsClient from './menu-posts-client'

interface MenuItem {
  id?: string
  title: string
  description: string
  price: string
  imageSrc: string
  imageHint?: string
  category: string
}

const defaultMenuItems: MenuItem[] = [
  {
    title: 'Alitas (300g)',
    description: 'BBQ, Red hot, Mango habanero ó Mix... +$35 papas a la francesa (200g) ó papas saratoga (40g) + 1 lata de refresco 355ml.',
    price: '$140.00 MXN',
    imageSrc: '/assets/menu/alimentos/alitas.png',
    imageHint: 'Alitas',
    category: 'Alimentos'
  },
  {
    title: 'Boneless (300g)',
    description: 'BBQ, Red hot, Mango habanero ó Mix... +$35 papas a la francesa (200g) ó papas saratoga (40g) + 1 lata de refresco 355ml.',
    price: '$150.00 MXN',
    imageSrc: '/assets/menu/alimentos/boneless.png',
    imageHint: 'Boneless',
    category: 'Alimentos'
  },
  {
    title: 'Hotdog (1pza)',
    description: '+$35 papas a la francesa (200g) ó papas saratoga (40g) + 1 lata de refresco 355ml.',
    price: '$60.00 MXN',
    imageSrc: '/assets/menu/alimentos/hotdog.png',
    imageHint: 'Hotdog',
    category: 'Alimentos'
  },
  {
    title: 'Nuggets de Pollo',
    description: 'Crujientes por fuera, tiernos por dentro. Acompañados de papas a la francesa.',
    price: '$120.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'chicken nuggets',
    category: 'Snacks'
  },
  {
    title: 'Agua (600ml)',
    description: 'Agua natural.',
    price: '$30.00 MXN',
    imageSrc: '/assets/menu/bebidas/agua600.png',
    imageHint: 'Agua 600ml',
    category: 'Bebidas'
  },
  {
    title: 'Gatorade (500ml)',
    description: 'Bebida hidratante.',
    price: '$45.00 MXN',
    imageSrc: '/assets/menu/bebidas/gatorade.png',
    imageHint: 'Gatorade',
    category: 'Bebidas'
  },
  {
    title: 'Refresco (355ml)',
    description: 'Botella o lata de varios sabores.',
    price: '$30.00 MXN',
    imageSrc: '/assets/menu/bebidas/refresco.png',
    imageHint: 'Refresco',
    category: 'Bebidas'
  },
  {
    title: 'Soda Pantera Rosa (414ml)',
    description: 'Pink Lemonade.',
    price: '$45.00 MXN',
    imageSrc: '/assets/menu/bebidas/sodaPanteraRosa.png',
    imageHint: 'Soda Pantera Rosa',
    category: 'Bebidas'
  },
  {
    title: 'Cerveza (325ml)',
    description: 'Tecate roja, Tecate light, Tecate ámbar, XX lager, XX ámbar e Indio. + $10 vaso michelado.',
    price: '$55.00 MXN',
    imageSrc: '/assets/menu/bebidas/cerveza.png',
    imageHint: 'Cerveza',
    category: 'Bebidas'
  },
  {
    title: 'Gomitas Ácidas',
    description: 'Una explosión de sabor que te hará hacer caras divertidas.',
    price: '$50.00 MXN',
    imageSrc: '/assets/g3.jpeg',
    imageHint: 'Gomitas',
    category: 'Dulces'
  }
]

const defaultCategories = ['Alimentos', 'Bebidas', 'Snacks', 'Dulces']
const FALLBACK_IMAGE = '/assets/menu/alimentos/alitas.png'

export default async function MenuPostsServer() {
  const supabase = await createServerComponentClient()
  let menuItems: MenuItem[] = defaultMenuItems
  let categories: string[] = defaultCategories

  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data && data.length) {
      menuItems = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        imageSrc: item.image_url || FALLBACK_IMAGE,
        imageHint: item.image_hint || item.title
      }))

      categories = Array.from(
        new Set(
          menuItems
            .map((item) => item.category)
            .filter((cat): cat is string => Boolean(cat))
        )
      )

      if (categories.length === 0) {
        categories = defaultCategories
      }
    }
  } catch (err) {
    console.error('Error fetching menu items:', err)
  }

  // Structured Data (JSON-LD) para SEO - MenuItemList
  const menuStructuredData = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "hasMenuSection": categories.map((category) => ({
      "@type": "MenuSection",
      "name": category,
      "hasMenuItem": menuItems
        .filter((item) => item.category === category)
        .map((item) => ({
          "@type": "MenuItem",
          "name": item.title,
          "description": item.description,
          "offers": {
            "@type": "Offer",
            "price": item.price.replace(/[^0-9.]/g, ''),
            "priceCurrency": "MXN"
          }
        }))
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuStructuredData) }}
      />
      <section id="menu" className="w-full py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl px-2 md:px-6">
          <MenuPostsClient initialMenuItems={menuItems} initialCategories={categories} />
        </div>
      </section>
    </>
  )
}

