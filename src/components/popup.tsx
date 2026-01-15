'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Si estamos en la página principal, limpiar el flag del popup para que se muestre de nuevo
    if (pathname === '/') {
      sessionStorage.removeItem('popup_seen_/')
    }
    fetchPopupConfig()
  }, [pathname])

  const fetchPopupConfig = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('popup_config')
        .select('is_active, images')
        .single()

      if (error) {
        // Si no existe la configuración, no mostrar popup
        if (error.code === 'PGRST116') {
          setIsOpen(false)
          return
        }
        console.error('Error fetching popup config:', error)
        setIsOpen(false)
        return
      }

      if (data && data.is_active && data.images && data.images.length > 0) {
        setImages(data.images)
        // Solo mostrar el popup en la página principal (ruta "/")
        // Y solo si no se ha cerrado en esta visita a la página principal
        if (pathname === '/') {
          const popupKey = `popup_seen_${pathname}`
          const hasSeenPopup = sessionStorage.getItem(popupKey)
          if (!hasSeenPopup) {
            setIsOpen(true)
          }
        } else {
          setIsOpen(false)
        }
      } else {
        setIsOpen(false)
      }
    } catch (err) {
      console.error('Error:', err)
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    // Marcar que el usuario ya vio el popup en esta visita a la página principal
    // Usar una clave específica para la ruta actual
    if (pathname === '/') {
      sessionStorage.setItem(`popup_seen_${pathname}`, 'true')
    }
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
      <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
        <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Botón de cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Contenedor de imagen */}
          <div className="relative w-full aspect-video bg-gray-100">
            <Image
              src={images[currentImageIndex]}
              alt={`Popup image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Controles de navegación si hay múltiples imágenes */}
          {images.length > 1 && (
            <>
              {/* Botón anterior */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              {/* Botón siguiente */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Indicadores de imágenes */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 bg-orange-500'
                        : 'w-2 bg-white/60 hover:bg-white/80'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Ir a imagen ${index + 1}`}
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
