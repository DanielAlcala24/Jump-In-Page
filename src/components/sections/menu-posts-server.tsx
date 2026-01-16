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

]

const defaultCategories = ['Alimentos', 'Bebidas', 'Snacks', 'Dulces']
const FALLBACK_IMAGE = '/assets/menu/alimentos/alitas.png'

export default async function MenuPostsServer() {
  const supabase = await createServerComponentClient()
  let menuItems: MenuItem[] = []
  let categories: string[] = []

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
    }
  } catch (err) {
    console.error('Error fetching menu items:', err)
  }

  if (menuItems.length === 0) {
    return null
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

