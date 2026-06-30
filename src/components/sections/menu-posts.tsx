'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { createClientComponentClient } from '@/lib/supabase'
import { X, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Branch {
  id: string
  name: string
  is_active: boolean
}

interface MenuItem {
  id?: string
  title: string
  description: string
  price: string
  imageSrc: string
  imageHint?: string
  category: string
  availableIn?: string[]
  order_index?: number
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
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedSucursal, setSelectedSucursal] = useState('Todas las sucursales')
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage])

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)

        // 1. Fetch Categories first to determine order
        const { data: catData, error: catError } = await supabase
          .from('menu_categories')
          .select('*')
          .order('order_index', { ascending: true })

        let fetchedCategories: string[] = []
        if (!catError && catData && catData.length > 0) {
          fetchedCategories = catData.map(c => c.name)
        }

        // 1.5 Fetch active branches for the filter
        const { data: branchData, error: branchError } = await supabase
          .from('branches')
          .select('id, name, is_active')
          .eq('is_active', true)
          .order('name', { ascending: true })

        if (!branchError && branchData) {
          setBranches(branchData)
        }

        // 2. Fetch Menu Items
        const { data, error } = await supabase
          .from('menu_items')
          .select('id, title, description, price, category, available_in, image_url, image_hint, order_index, created_at')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: true })

        if (!error && data && data.length) {
          const mapped = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            availableIn: item.available_in || [],
            imageSrc: item.image_url || FALLBACK_IMAGE,
            imageHint: item.image_hint || item.title
          }))

          setMenuItems(mapped)

          // If we didn't get categories from the table, derive them from items (unsorted)
          if (fetchedCategories.length === 0) {
            fetchedCategories = Array.from(
              new Set(
                mapped
                  .map((item) => item.category)
                  .filter((cat): cat is string => Boolean(cat))
              )
            )
          }

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

  const isAvailableInSucursal = (item: MenuItem) => {
    if (selectedSucursal === 'Todas las sucursales') return true
    if (!item.availableIn || item.availableIn.length === 0) return true
    return (
      item.availableIn.includes('Todas las sucursales') ||
      item.availableIn.includes(selectedSucursal)
    )
  }

  const itemsBySucursal = useMemo(() => {
    return menuItems.filter(isAvailableInSucursal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems, selectedSucursal])

  const itemsToDisplay = useMemo(() => {
    return itemsBySucursal.filter((item) => item.category === selectedCategory)
  }, [itemsBySucursal, selectedCategory])

  if (!loading && menuItems.length === 0) {
    return null
  }

  return (
    <section id="menu" className="w-full py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-2 md:px-6">
        {branches.length > 0 && (
          <div className="flex justify-center mb-4">
            <Select value={selectedSucursal} onValueChange={setSelectedSucursal}>
              <SelectTrigger className="w-full sm:w-[280px] shadow-lg">
                <SelectValue placeholder="Selecciona una sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas las sucursales">Todas las sucursales</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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
        ) : itemsToDisplay.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg font-medium">No hay productos en esta categoría</p>
            <p className="text-sm">
              {selectedSucursal === 'Todas las sucursales'
                ? 'Prueba seleccionando otra categoría.'
                : `No hay productos de "${selectedCategory}" disponibles en ${selectedSucursal}.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsToDisplay.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950"
              >
                <div
                  className="relative w-full aspect-square bg-white dark:bg-gray-950 cursor-pointer group/img"
                  onClick={() => setSelectedImage(item.imageSrc || FALLBACK_IMAGE)}
                >
                  <Image
                    src={item.imageSrc || FALLBACK_IMAGE}
                    alt={item.title}
                    fill
                    data-ai-hint={item.imageHint}
                    className="object-contain transition-transform duration-300 group-hover:scale-105 group-hover/img:scale-110 p-2"
                  />
                  {/* Overlay on hover for visual cue */}
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
                <div className="flex flex-1 flex-col p-6 text-center">
                  <h3 className="mb-2 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">
                    {item.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                  {(() => {
                    const displayPrice = formatPrice(item.price)
                    const isZero =
                      !item.price ||
                      item.price.trim() === '0' ||
                      item.price.trim() === '0.00' ||
                      displayPrice === '$0.00 MXN'

                    if (isZero) return null

                    return (
                      <div className="mt-auto">
                        <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-base font-bold text-primary font-headline">
                          {displayPrice}
                        </div>
                      </div>
                    )
                  })()}

                  {item.availableIn && item.availableIn.length > 0 && (
                    <div className="mt-4 pt-3 border-t dark:border-gray-800">
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-center">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        Disponible en:
                      </h4>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {item.availableIn.includes('Todas las sucursales') ? (
                          <Badge variant="outline" className="font-normal bg-blue-100 text-blue-800 border-blue-300">
                            Todas las sucursales
                          </Badge>
                        ) : (
                          item.availableIn.map((sucursal) => (
                            <Badge key={sucursal} variant="outline" className="font-normal bg-blue-100 text-blue-800 border-blue-300">
                              {sucursal}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-gray-300 transition-colors z-[110] bg-black/50 hover:bg-black/70 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(null)
            }}
            aria-label="Cerrar vista completa"
          >
            <X className="h-6 w-6 md:h-8 md:w-8" />
          </button>

          <div
            className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Platillo a tamaño completo"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </section>
  )
}