'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, File, Image as ImageIcon, Trash2, Eye, Copy, Home } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

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

interface PendingFile {
  id: string
  originalFile: File
  optimizedFile: File | null
  customFileName: string
  imageHint: string
  originalSize: number
  isOptimizing: boolean
  isUploading: boolean
  error?: string
}

export default function MediaPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkAuth()
    fetchFiles()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin/login')
      return
    }
    setUser(user)
  }

  const fetchFiles = async () => {
    try {
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
        // Mapear los datos de Supabase al formato FileItem
        const mappedFiles = (data || []).map((file: any) => ({
          name: file.name,
          id: file.id,
          updated_at: file.updated_at,
          created_at: file.created_at,
          last_accessed_at: file.last_accessed_at,
          metadata: {
            eTag: file.metadata?.eTag || '',
            size: file.metadata?.size || 0,
            mimetype: file.metadata?.mimetype || '',
            cacheControl: file.metadata?.cacheControl || '',
            lastModified: file.metadata?.lastModified || '',
            contentLength: file.metadata?.contentLength || 0,
            httpStatusCode: file.metadata?.httpStatusCode || 200
          }
        }))
        setFiles(mappedFiles)
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al cargar archivos')
    } finally {
      setLoading(false)
    }
  }

  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      // Solo optimizar imágenes
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
          // Tamaño máximo más agresivo para reducir ancho de banda
          const MAX_WIDTH = 1600  // Reducido de 1920
          const MAX_HEIGHT = 1600 // Reducido de 1920
          
          // Calidad adaptativa según el tamaño original
          // Imágenes grandes: más compresión, imágenes pequeñas: menos compresión
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
          const originalWidth = width
          const originalHeight = height

          // Redimensionar si es necesario manteniendo la proporción
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

          // Dibujar la imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height)

          // Intentar usar WebP primero (mejor compresión), luego JPEG
          // WebP puede reducir el tamaño en 25-35% comparado con JPEG
          const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
          
          // Decidir el formato de salida
          // Preferir JPEG sobre PNG (más pequeño), y WebP si está disponible
          let outputType = 'image/jpeg'
          let outputExt = 'jpg'
          
          // Si el archivo original es PNG con transparencia, mantener PNG
          // Pero si no tiene transparencia, convertir a JPEG para mejor compresión
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

          // Convertir a blob con compresión optimizada
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Error al crear el blob'))
                return
              }

              // Crear un nuevo archivo con el nombre original pero optimizado
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    // Crear objetos PendingFile para cada archivo seleccionado
    const newPendingFiles: PendingFile[] = selectedFiles.map((file) => {
      const baseName = file.name.replace(/\.[^/.]+$/, '')
      return {
        id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
        originalFile: file,
        optimizedFile: null,
        customFileName: baseName,
        imageHint: '',
        originalSize: file.size,
        isOptimizing: false,
        isUploading: false
      }
    })

    // Agregar los nuevos archivos a la lista
    setPendingFiles((prev) => [...prev, ...newPendingFiles])

    // Optimizar imágenes en paralelo después de que el estado se actualice
    // Usar requestAnimationFrame para asegurar que el estado se haya actualizado
    requestAnimationFrame(() => {
      newPendingFiles.forEach((pendingFile) => {
        if (pendingFile.originalFile.type.startsWith('image/') && 
            pendingFile.originalFile.type !== 'image/svg+xml') {
          optimizePendingFile(pendingFile.id, pendingFile.originalFile, pendingFile.originalSize)
        } else {
          // Para archivos que no son imágenes, usar el archivo original inmediatamente
          setPendingFiles((prev) =>
            prev.map((pf) =>
              pf.id === pendingFile.id
                ? { ...pf, optimizedFile: pf.originalFile }
                : pf
            )
          )
        }
      })
    })

    // Limpiar el input
    e.target.value = ''
  }

  const optimizePendingFile = async (fileId: string, file: File, originalSize: number) => {
    // Actualizar estado a "optimizando"
    setPendingFiles((prev) =>
      prev.map((pf) =>
        pf.id === fileId ? { ...pf, isOptimizing: true } : pf
      )
    )

    try {
      const optimizedFile = await optimizeImage(file)
      setPendingFiles((prev) =>
        prev.map((pf) =>
          pf.id === fileId
            ? {
                ...pf,
                optimizedFile,
                isOptimizing: false
              }
            : pf
        )
      )
      toast.success(
        `${file.name}: ${formatFileSize(originalSize)} → ${formatFileSize(optimizedFile.size)}`
      )
    } catch (error) {
      console.error('Error al optimizar imagen:', error)
      setPendingFiles((prev) =>
        prev.map((pf) =>
          pf.id === fileId
            ? {
                ...pf,
                optimizedFile: pf.originalFile,
                isOptimizing: false,
                error: 'Error al optimizar, se subirá el original'
              }
            : pf
        )
      )
      toast.error(`Error al optimizar ${file.name}`)
    }
  }

  const updatePendingFile = (fileId: string, updates: Partial<PendingFile>) => {
    setPendingFiles((prev) =>
      prev.map((pf) => (pf.id === fileId ? { ...pf, ...updates } : pf))
    )
  }

  const removePendingFile = (fileId: string) => {
    setPendingFiles((prev) => prev.filter((pf) => pf.id !== fileId))
  }

  const uploadFile = async (fileId: string) => {
    // Leer el archivo directamente del estado actual
    const pendingFile = pendingFiles.find((pf) => pf.id === fileId)

    if (!pendingFile) {
      console.error('Archivo no encontrado:', fileId)
      toast.error('Archivo no encontrado')
      return
    }

    // Verificar que el archivo esté listo para subir
    if (pendingFile.isOptimizing) {
      console.warn('Archivo aún se está optimizando:', pendingFile.originalFile.name)
      toast.error('Espera a que termine la optimización')
      return
    }

    if (pendingFile.isUploading) {
      console.warn('Archivo ya se está subiendo:', pendingFile.originalFile.name)
      return
    }

    const fileToUpload = pendingFile.optimizedFile || pendingFile.originalFile
    if (!fileToUpload) {
      console.error('No hay archivo para subir:', pendingFile.originalFile.name)
      toast.error('No hay archivo para subir')
      return
    }

    // Actualizar estado a "subiendo"
    updatePendingFile(fileId, { isUploading: true })

    try {
      const fileExt = fileToUpload.name.split('.').pop() || 'file'
      
      // Usar nombre personalizado si se proporcionó, sino usar el nombre original
      let finalFileName: string
      if (pendingFile.customFileName.trim()) {
        // Limpiar el nombre personalizado (remover caracteres especiales)
        const cleanName = pendingFile.customFileName.trim().replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
        finalFileName = `${cleanName}.${fileExt}`
      } else {
        // Generar nombre único con timestamp y random
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 9)
        finalFileName = `${timestamp}-${random}.${fileExt}`
      }

      console.log('Subiendo archivo:', {
        nombre: finalFileName,
        tamaño: fileToUpload.size,
        tipo: fileToUpload.type,
        original: pendingFile.originalFile.name
      })

      const { data, error } = await supabase.storage
        .from('media')
        .upload(finalFileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading file:', error)
        updatePendingFile(fileId, { 
          isUploading: false, 
          error: `Error: ${error.message}` 
        })
        toast.error(`Error al subir ${pendingFile.originalFile.name}: ${error.message}`)
        throw new Error(error.message)
      }

      console.log('Archivo subido exitosamente:', data)

      // Si es una imagen y tiene hint, guardar metadata
      if (fileToUpload.type.startsWith('image/') && pendingFile.imageHint.trim()) {
        try {
          // Intentar guardar en tabla media_metadata si existe
          const { error: metadataError } = await supabase
            .from('media_metadata')
            .insert({
              file_name: finalFileName,
              hint: pendingFile.imageHint.trim(),
              custom_name: pendingFile.customFileName.trim() || null
            })

          if (metadataError) {
            // Si la tabla no existe, solo mostrar advertencia pero continuar
            console.warn('No se pudo guardar metadata (tabla puede no existir):', metadataError)
          } else {
            console.log('Metadata guardada exitosamente')
          }
        } catch (metadataErr) {
          console.warn('Error guardando metadata:', metadataErr)
        }
      }

      toast.success(`${pendingFile.originalFile.name} subido exitosamente`)
      
      // Remover el archivo de la lista pendiente
      removePendingFile(fileId)
      
    } catch (err) {
      console.error('Error en uploadFile:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      updatePendingFile(fileId, { 
        isUploading: false, 
        error: `Error: ${errorMessage}` 
      })
      toast.error(`Error al subir ${pendingFile.originalFile.name}: ${errorMessage}`)
      throw err
    }
  }

  const uploadAllFiles = async () => {
    // Usar el estado actual de archivos pendientes
    const currentPendingFiles = [...pendingFiles]

    if (currentPendingFiles.length === 0) {
      toast.error('No hay archivos para subir')
      return
    }

    // Filtrar solo archivos que estén listos (no optimizando, no subiendo, y tienen archivo)
    const readyFiles = currentPendingFiles.filter(
      (pf) => !pf.isOptimizing && !pf.isUploading && (pf.optimizedFile || pf.originalFile)
    )

    if (readyFiles.length === 0) {
      toast.error('No hay archivos listos para subir. Espera a que terminen de optimizarse.')
      return
    }

    setUploading(true)
    
    // Subir archivos secuencialmente para evitar sobrecarga
    let successCount = 0
    let errorCount = 0
    
    try {
      for (const pendingFile of readyFiles) {
        try {
          console.log(`Iniciando subida de archivo: ${pendingFile.originalFile.name}`)
          await uploadFile(pendingFile.id)
          successCount++
          console.log(`Archivo ${pendingFile.originalFile.name} subido exitosamente`)
        } catch (err) {
          console.error('Error subiendo archivo:', err)
          errorCount++
        }
      }
      
      if (errorCount === 0 && successCount > 0) {
        toast.success(`Todos los archivos (${successCount}) han sido subidos exitosamente`)
      } else if (successCount > 0) {
        toast.warning(`${successCount} archivos subidos, ${errorCount} con errores`)
      } else {
        toast.error('No se pudo subir ningún archivo')
      }

      // Refrescar la lista de archivos al final
      fetchFiles()
    } catch (err) {
      console.error('Error en subida masiva:', err)
      toast.error('Error al procesar algunos archivos')
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (fileName: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return

    try {
      const { error } = await supabase.storage
        .from('media')
        .remove([fileName])

      if (error) {
        console.error('Error deleting file:', error)
        toast.error('Error al eliminar archivo')
      } else {
        toast.success('Archivo eliminado exitosamente')
        fetchFiles() // Refresh the list
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al eliminar archivo')
    }
  }

  const getFileUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(fileName)
    return data.publicUrl
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copiada al portapapeles')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Volver al Panel
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Administrador de Multimedia</h1>
            <p className="text-gray-600">Sube y gestiona tus archivos multimedia</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Archivos
          </CardTitle>
          <CardDescription>
            Selecciona uno o múltiples archivos para subir al almacenamiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Archivos (Múltiples)</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*,application/*,text/*"
                multiple
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes seleccionar múltiples archivos a la vez. Las imágenes se optimizarán automáticamente.
              </p>
            </div>

            {pendingFiles.length > 0 && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Archivos pendientes ({pendingFiles.length})
                  </p>
                  <Button
                    onClick={uploadAllFiles}
                    disabled={uploading || pendingFiles.some((pf) => pf.isOptimizing || pf.isUploading)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {uploading ? 'Subiendo...' : 'Subir Todos'}
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingFiles.map((pendingFile) => (
                    <Card key={pendingFile.id} className="border-2">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {pendingFile.originalFile.name}
                            </p>
                            <div className="text-xs text-gray-500 space-y-1 mt-1">
                              <p>
                                Tamaño original: {formatFileSize(pendingFile.originalSize)}
                              </p>
                              {pendingFile.optimizedFile && pendingFile.optimizedFile.size < pendingFile.originalSize && (
                                <p className="text-green-600">
                                  ✓ Optimizado: {formatFileSize(pendingFile.optimizedFile.size)} 
                                  ({(100 - (pendingFile.optimizedFile.size / pendingFile.originalSize) * 100).toFixed(1)}% reducción)
                                </p>
                              )}
                              {pendingFile.isOptimizing && (
                                <p className="text-orange-500">Optimizando imagen...</p>
                              )}
                              {pendingFile.error && (
                                <p className="text-red-500">{pendingFile.error}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removePendingFile(pendingFile.id)}
                            disabled={pendingFile.isUploading}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div>
                          <Label htmlFor={`customFileName-${pendingFile.id}`} className="text-xs">
                            Nombre del Archivo (Opcional)
                          </Label>
                          <Input
                            id={`customFileName-${pendingFile.id}`}
                            type="text"
                            placeholder="Ej: logo-jump-in, imagen-hero, etc."
                            value={pendingFile.customFileName}
                            onChange={(e) =>
                              updatePendingFile(pendingFile.id, {
                                customFileName: e.target.value
                              })
                            }
                            className="mt-1 text-sm"
                            disabled={pendingFile.isUploading}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Solo letras, números, guiones y guiones bajos.
                          </p>
                        </div>

                        {pendingFile.originalFile.type.startsWith('image/') && (
                          <div>
                            <Label htmlFor={`imageHint-${pendingFile.id}`} className="text-xs">
                              Hint para SEO (Opcional)
                            </Label>
                            <Input
                              id={`imageHint-${pendingFile.id}`}
                              type="text"
                              placeholder="Ej: trampoline park, jumping friends, logo jump-in"
                              value={pendingFile.imageHint}
                              onChange={(e) =>
                                updatePendingFile(pendingFile.id, {
                                  imageHint: e.target.value
                                })
                              }
                              className="mt-1 text-sm"
                              disabled={pendingFile.isUploading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Descripción breve para SEO y accesibilidad.
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={() => uploadFile(pendingFile.id)}
                          disabled={pendingFile.isOptimizing || pendingFile.isUploading}
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          size="sm"
                        >
                          {pendingFile.isOptimizing
                            ? 'Optimizando...'
                            : pendingFile.isUploading
                            ? 'Subiendo...'
                            : 'Subir Este Archivo'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5" />
            Archivos ({files.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p>Cargando archivos...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay archivos subidos aún</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                  {isImage(file.name) ? (
                    <>
                      {/* Vista de imagen con miniatura */}
                      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden group">
                        <Image
                          src={getFileUrl(file.name)}
                          alt={file.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium truncate mb-1" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{formatFileSize(file.metadata.size)}</span>
                          <span>{new Date(file.created_at).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(getFileUrl(file.name), '_blank')}
                            className="flex-1 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(getFileUrl(file.name))}
                            className="flex-1 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteFile(file.name)}
                            className="px-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Vista de archivo no-imagen */}
                      <div className="p-6 bg-gray-50 flex items-center justify-center">
                        <File className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium truncate mb-1" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{formatFileSize(file.metadata.size)}</span>
                          <span>{new Date(file.created_at).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(getFileUrl(file.name), '_blank')}
                            className="flex-1 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(getFileUrl(file.name))}
                            className="flex-1 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteFile(file.name)}
                            className="px-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
