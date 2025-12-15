'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ImageIcon, Search, X, Check } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

interface FileItem {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: {
    eTag: string
    size: number
    mimetype: string
    cacheControl: string
    lastModified: string
    contentLength: number
    httpStatusCode: number
  }
}

interface MediaSelectorProps {
  value?: string
  onSelect: (url: string) => void
  label?: string
}

export default function MediaSelector({ value, onSelect, label = 'Seleccionar Imagen' }: MediaSelectorProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUrl, setSelectedUrl] = useState<string | null>(value || null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (open) {
      fetchFiles()
    }
  }, [open])

  useEffect(() => {
    setSelectedUrl(value || null)
  }, [value])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.storage
        .from('media')
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) {
        console.error('Error fetching files:', error)
        toast.error('Error al cargar archivos')
      } else {
        // Filtrar solo imágenes
        const imageFiles = (data || []).filter(file => isImage(file.name))
        setFiles(imageFiles)
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al cargar archivos')
    } finally {
      setLoading(false)
    }
  }

  const getFileUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(fileName)
    return data.publicUrl
  }

  const isImage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
  }

  const handleSelect = (url: string) => {
    setSelectedUrl(url)
    onSelect(url)
    setOpen(false)
  }

  const handleClear = () => {
    setSelectedUrl(null)
    onSelect('')
  }

  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
        resolve(file)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img')
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('No se pudo crear el contexto del canvas'))
            return
          }

          // Configuración de optimización mejorada
          const MAX_WIDTH = 1600  // Reducido de 1920
          const MAX_HEIGHT = 1600 // Reducido de 1920
          
          // Calidad adaptativa según el tamaño original
          const originalSize = file.size
          let QUALITY = 0.75 // Calidad base reducida de 0.85
          
          // Si la imagen es muy grande (>5MB), usar más compresión
          if (originalSize > 5 * 1024 * 1024) {
            QUALITY = 0.65
          } else if (originalSize > 2 * 1024 * 1024) {
            QUALITY = 0.70
          } else if (originalSize < 500 * 1024) {
            // Imágenes pequeñas pueden mantener mejor calidad
            QUALITY = 0.80
          }
          
          let width = img.width
          let height = img.height

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = (height * MAX_WIDTH) / width
              width = MAX_WIDTH
            } else {
              width = (width * MAX_HEIGHT) / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height

          // Mejorar la calidad del renderizado
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'

          ctx.drawImage(img, 0, 0, width, height)

          // Intentar usar WebP primero (mejor compresión), luego JPEG
          const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
          
          // Decidir el formato de salida
          let outputType = 'image/jpeg'
          let outputExt = 'jpg'
          
          // Si el archivo original es PNG con transparencia, mantener PNG
          if (file.type === 'image/png') {
            // Verificar si tiene transparencia (alpha channel)
            const imageData = ctx.getImageData(0, 0, Math.min(100, width), Math.min(100, height))
            const hasTransparency = Array.from(imageData.data).some((_, i) => i % 4 === 3 && imageData.data[i] < 255)
            
            if (hasTransparency) {
              outputType = 'image/png'
              outputExt = 'png'
            } else {
              // Sin transparencia, convertir a JPEG para mejor compresión
              outputType = 'image/jpeg'
              outputExt = 'jpg'
            }
          }

          // Intentar WebP si está disponible y no hay transparencia
          if (supportsWebP && outputType !== 'image/png') {
            outputType = 'image/webp'
            outputExt = 'webp'
            QUALITY = Math.max(0.70, QUALITY) // WebP puede usar calidad ligeramente menor
          }

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Error al crear el blob'))
                return
              }

              const fileName = file.name.replace(/\.[^/.]+$/, '')
              const FileConstructor = globalThis.File as any
              const optimizedFile = new FileConstructor(
                [blob],
                `${fileName}.${outputExt}`,
                {
                  type: outputType,
                  lastModified: Date.now()
                }
              ) as File

              resolve(optimizedFile)
            },
            outputType,
            QUALITY
          )
        }
        img.onerror = () => reject(new Error('Error al cargar la imagen'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      toast.error('Por favor selecciona una imagen válida')
      return
    }

    setUploading(true)
    setOptimizing(true)

    try {
      // Optimizar la imagen
      const optimizedFile = await optimizeImage(file)
      setOptimizing(false)

      // Subir a Supabase
      const fileExt = optimizedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, optimizedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading file:', error)
        toast.error('Error al subir archivo')
      } else {
        toast.success('Imagen subida exitosamente')
        // Obtener la URL de la imagen subida
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(fileName)
        
        // Seleccionar automáticamente la imagen subida
        handleSelect(urlData.publicUrl)
        
        // Actualizar la lista de archivos
        fetchFiles()
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al procesar la imagen')
    } finally {
      setUploading(false)
      setOptimizing(false)
      // Limpiar el input
      e.target.value = ''
    }
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              <ImageIcon className="h-4 w-4 mr-2" />
              {selectedUrl ? 'Cambiar Imagen' : label}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Seleccionar Imagen de Multimedia</DialogTitle>
              <DialogDescription>
                Elige una imagen de tu biblioteca o sube una nueva
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Sección de subida */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <Label htmlFor="upload-image" className="text-sm font-medium mb-2 block">
                  Subir Nueva Imagen
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="upload-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading || optimizing}
                    className="flex-1"
                  />
                  {optimizing && (
                    <span className="text-xs text-orange-500">Optimizando...</span>
                  )}
                  {uploading && !optimizing && (
                    <span className="text-xs text-blue-500">Subiendo...</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  La imagen se optimizará automáticamente antes de subir
                </p>
              </div>

              {/* Separador */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">O selecciona una existente</span>
                </div>
              </div>

              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar imágenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p>Cargando imágenes...</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{searchTerm ? 'No se encontraron imágenes' : 'No hay imágenes disponibles'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => {
                    const url = getFileUrl(file.name)
                    const isSelected = selectedUrl === url
                    return (
                      <div
                        key={file.id}
                        className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                          isSelected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => handleSelect(url)}
                      >
                        <div className="aspect-square relative bg-gray-100">
                          <Image
                            src={url}
                            alt={file.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                              <div className="bg-orange-500 rounded-full p-2">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="text-xs font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        {selectedUrl && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {selectedUrl && (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={selectedUrl}
            alt="Imagen seleccionada"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}
      {selectedUrl && (
        <p className="text-xs text-gray-500 truncate">
          {selectedUrl}
        </p>
      )}
    </div>
  )
}

