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
      <DialogContent className="max-w-[100vw] md:max-w-4xl w-full md:w-fit p-0 bg-transparent border-none shadow-none">
        <div className="relative flex items-center justify-center bg-transparent overflow-hidden sm:rounded-lg shadow-2xl">
          {/* Botón de cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Contenedor de imagen */}
          <div className="relative max-h-[85vh] w-full flex items-center justify-center bg-gray-900/10">
            <img
              src={images[currentImageIndex]}
              alt={`Popup image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] h-auto w-auto object-contain rounded-lg"
            />
          </div>

          {/* Controles de navegación si hay múltiples imágenes */}
          {images.length > 1 && (
            <>
              {/* Botón anterior */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors h-10 w-10 md:h-12 md:w-12"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              {/* Botón siguiente */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors h-10 w-10 md:h-12 md:w-12"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Indicadores de imágenes */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${index === currentImageIndex
                      ? 'w-10 bg-orange-500 shadow-lg'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
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
