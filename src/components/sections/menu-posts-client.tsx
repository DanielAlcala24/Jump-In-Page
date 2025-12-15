'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface MenuItem {
  id?: string
  title: string
  description: string
  price: string
  imageSrc: string
  imageHint?: string
  category: string
}

const FALLBACK_IMAGE = '/assets/menu/alimentos/alitas.png'

const formatPrice = (price: string) => {
  if (!price) return ''
  const normalized = price.trim()

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

interface MenuPostsClientProps {
  initialMenuItems: MenuItem[]
  initialCategories: string[]
}

export default function MenuPostsClient({ initialMenuItems, initialCategories }: MenuPostsClientProps) {
  const [menuItems] = useState<MenuItem[]>(initialMenuItems)
  const [categories] = useState<string[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState(initialCategories[0] || '')

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => item.category === selectedCategory)
  }, [menuItems, selectedCategory])

  const itemsToDisplay = filteredItems.length > 0 ? filteredItems : menuItems.filter(Boolean)

  return (
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {itemsToDisplay.map((item, index) => (
          <div
            key={`${item.id || item.title}-${index}`}
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
    </>
  )
}

