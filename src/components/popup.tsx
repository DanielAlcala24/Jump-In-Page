'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// Memory cache to avoid redundant database hits during the same session
let cachedPopupConfig: { is_active: boolean, images: string[] } | null = null;

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  // Memoize Supabase client to avoid unnecessary re-initialization
  const supabase = useMemo(() => createClientComponentClient(), [])

  const fetchPopupConfig = useCallback(async () => {
    // The popup is only intended for the home page
    if (pathname !== '/') {
      setIsLoading(false)
      setIsOpen(false)
      return
    }

    // Optimization: If we already have the config in memory, use it
    if (cachedPopupConfig) {
      if (cachedPopupConfig.is_active && cachedPopupConfig.images.length > 0) {
        setImages(cachedPopupConfig.images)
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('popup_config')
        .select('is_active, images')
        .single()

      if (error) {
        // PGRST116 means no rows found, which is fine
        if (error.code !== 'PGRST116') {
          console.error('Error fetching popup config:', error)
        }
        cachedPopupConfig = { is_active: false, images: [] }
        setIsOpen(false)
        return
      }

      if (data) {
        cachedPopupConfig = { is_active: data.is_active, images: data.images || [] }
        if (data.is_active && data.images && data.images.length > 0) {
          setImages(data.images)
          setIsOpen(true)
        } else {
          setIsOpen(false)
        }
      }
    } catch (err) {
      console.error('Error fetching popup config:', err)
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [pathname, supabase])

  useEffect(() => {
    // Reset image index when navigating back to home
    if (pathname === '/') {
      setCurrentImageIndex(0)
    }

    // Optimization: Delay the popup check slightly to prioritize main content LCP
    const timer = setTimeout(() => {
      fetchPopupConfig()
    }, 1200) // Slightly reduced delay for better feel on return

    return () => clearTimeout(timer)
  }, [fetchPopupConfig, pathname])

  // Preload next image if there are multiple images
  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentImageIndex + 1) % images.length
      const img = new (window as any).Image()
      img.src = images[nextIndex]
    }
  }, [currentImageIndex, images])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  if (isLoading || !isOpen || images.length === 0) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl w-full md:w-fit p-0 bg-transparent border-none shadow-none focus:outline-none overflow-hidden">
        <div className="relative flex items-center justify-center bg-transparent sm:rounded-lg overflow-hidden">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all duration-200 hover:scale-110 active:scale-95 border border-white/10"
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Image Container with aspect-ratio protection and next/image optimization */}
          <div className="relative max-h-[85vh] w-full flex items-center justify-center bg-black/5 min-h-[200px] min-w-[200px]">
            <Image
              src={images[currentImageIndex]}
              alt={`Promoción Jump-In ${currentImageIndex + 1}`}
              width={1200}
              height={1200}
              priority
              quality={85}
              className="max-w-full max-h-[85vh] h-auto w-auto object-contain rounded-lg shadow-2xl transition-opacity duration-300"
              onLoadingComplete={() => setIsLoading(false)}
            />
          </div>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors h-10 w-10 md:h-12 md:w-12 backdrop-blur-sm"
                onClick={handlePrevious}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors h-10 w-10 md:h-12 md:w-12 backdrop-blur-sm"
                onClick={handleNext}
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                      ? 'w-10 bg-orange-500 shadow-orange-500/50 shadow-lg'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`Ver imagen ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
