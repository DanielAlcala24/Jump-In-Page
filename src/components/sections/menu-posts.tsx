'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { createClientComponentClient } from '@/lib/supabase'

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
    description:
      'BBQ, Red hot, Mango habanero ó Mix... +$35 papas a la francesa (200g) ó papas saratoga (40g) + 1 lata de refresco 355ml.',
    price: '$140.00 MXN',
    imageSrc: '/assets/menu/alimentos/alitas.png',
    imageHint: 'Alitas',
    category: 'Alimentos'
  },
  {
    title: 'Boneless (300g)',
    description:
      'BBQ, Red hot, Mango habanero ó Mix... +$35 papas a la francesa (200g) ó papas saratoga (40g) + 1 lata de refresco 355ml.',
    price: '$150.00 MXN',
    imageSrc: '/assets/menu/alimentos/boneless.png',
    imageHint: 'Boneless',
    category: 'Alimentos'
  },
  {
    title: 'Hotdog (1pza)',
    description:
      '+$35 papas a la francesa (200g) ó papas saratoga (40g) + 1 lata de refresco 355ml.',
    price: '$60.00 MXN',
    imageSrc: '/assets/menu/alimentos/hotdog.png',
    imageHint: 'Hotdog',
    category: 'Alimentos'
  },
  {
    title: 'Nuggets de Pollo',
    description:
      'Crujientes por fuera, tiernos por dentro. Acompañados de papas a la francesa.',
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
    description:
      'Tecate roja, Tecate light, Tecate ámbar, XX lager, XX ámbar e Indio. + $10 vaso michelado.',
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

const formatPrice = (price: string) => {
  if (!price) return ''
  const normalized = price.trim()

  // If already formatted with currency, return as is
  if (
    normalized.includes('$') ||
    normalized.toLowerCase().includes('mxn')
  ) {
    return normalized
  }

  const numericValue = Number(
    normalized
      .replace(/[^0-9.,]/g, '')
      .replace(',', '.')
  )

  if (Number.isNaN(numericValue)) {
    return price
  }

  return `$${numericValue.toFixed(2)} MXN`
}

export default function MenuPosts() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('created_at', { ascending: true })

        if (!error && data && data.length) {
          const mapped = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            imageSrc: item.image_url || FALLBACK_IMAGE,
            imageHint: item.image_hint || item.title
          }))

          setMenuItems(mapped)

          const fetchedCategories = Array.from(
            new Set(
              mapped
                .map((item) => item.category)
                .filter((cat): cat is string => Boolean(cat))
            )
          )

          if (fetchedCategories.length) {
            setCategories(fetchedCategories)
            setSelectedCategory((prev) =>
              fetchedCategories.includes(prev)
                ? prev
                : fetchedCategories[0] || prev
            )
          }
        } else {
          setMenuItems([])
          setCategories([])
        }
      } catch (err) {
        console.error('Error fetching menu items:', err)
        setMenuItems([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [supabase])

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => item.category === selectedCategory)
  }, [menuItems, selectedCategory])

  const itemsToDisplay =
    filteredItems.length > 0 ? filteredItems : menuItems.filter(Boolean)

  if (!loading && menuItems.length === 0) {
    return null
  }

  return (
    <section id="menu" className="w-full py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-2 md:px-6">
        <div className="sticky top-14 z-30 py-4 mb-8">
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center items-center bg-white border border-gray-200 rounded-full p-1 shadow-lg">
              {categories.map((category, index) => (
                <React.Fragment key={category}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'transition-colors duration-300 text-base font-medium h-auto py-2 px-2',
                      'focus-visible:ring-transparent whitespace-nowrap',
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-primary hover:bg-primary/10',
                      'rounded-full'
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                  {index < categories.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="h-6 bg-gray-200 last-of-type:hidden"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Cargando menú...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsToDisplay.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={item.imageSrc || FALLBACK_IMAGE}
                    alt={item.title}
                    fill
                    data-ai-hint={item.imageHint}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 text-center">
                  <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">
                    {item.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                  <div className="mt-auto">
                    <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-base font-bold text-primary font-headline">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}