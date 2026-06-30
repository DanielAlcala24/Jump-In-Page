'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'

interface Branch {
  id: string
  name: string
  is_active: boolean
}

export default function NewKnowledgeEntryPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [branchesSelected, setBranchesSelected] = useState<string[]>(['Todas las sucursales'])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loadingBranches, setLoadingBranches] = useState(true)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true)
        const { data, error } = await supabase
          .from('branches')
          .select('id, name, is_active')
          .eq('is_active', true)
          .order('name', { ascending: true })

        if (!error && data) {
          setBranches(data)
        }
      } catch (err) {
        console.error('Error fetching branches:', err)
      } finally {
        setLoadingBranches(false)
      }
    }

    fetchBranches()
  }, [supabase])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('knowledge_base')
          .select('knowledge_category')

        if (!error && data) {
          const unique = Array.from(
            new Set(
              data
                .map((row) => row.knowledge_category)
                .filter((cat): cat is string => Boolean(cat))
            )
          ).sort((a, b) => a.localeCompare(b))
          setCategories((prev) => Array.from(new Set([...unique, ...prev])))
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [supabase])

  const handleCreateCategory = () => {
    const trimmedName = newCategoryName.trim()
    if (!trimmedName) return
    if (!categories.includes(trimmedName)) {
      setCategories((prev) => [...prev, trimmedName])
    }
    setCategory(trimmedName)
    setNewCategoryName('')
    setShowNewCategory(false)
  }

  const handleSucursalToggle = (sucursal: string) => {
    setBranchesSelected((prev) => {
      if (prev.includes(sucursal)) {
        return prev.filter((s) => s !== sucursal)
      } else {
        return [...prev.filter((s) => s !== 'Todas las sucursales'), sucursal]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!question.trim() || !answer.trim()) {
      setError('La pregunta y la respuesta son obligatorias')
      return
    }

    if (branchesSelected.length === 0) {
      setError('Debes seleccionar al menos una sucursal')
      return
    }

    setLoading(true)
    try {
      // Obtener el siguiente orden
      const { data: existingEntries } = await supabase
        .from('knowledge_base')
        .select('order')
        .order('order', { ascending: false })
        .limit(1)

      const nextOrder = existingEntries && existingEntries.length > 0
        ? (existingEntries[0].order || 0) + 1
        : 0

      const { error } = await supabase.from('knowledge_base').insert([
        {
          question: question.trim(),
          answer: answer.trim(),
          knowledge_category: category.trim() || null,
          branches: branchesSelected,
          is_active: isActive,
          order: nextOrder,
          created_at: new Date().toISOString()
        }
      ])

      if (error) {
        setError(error.message)
        console.error('Error al guardar:', error)
      } else {
        router.push('/admin/base-conocimiento')
      }
    } catch (err) {
      console.error('Error inesperado:', err)
      setError('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4">
            <Link href="/admin/base-conocimiento">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Pregunta</h1>
              <p className="text-sm text-gray-600">Agrega una nueva pregunta a la base de conocimiento</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Pregunta</CardTitle>
            <CardDescription>Completa la pregunta y su respuesta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">Pregunta *</Label>
                <Input
                  id="question"
                  type="text"
                  placeholder="Ej: ¿Cuál es el horario de atención?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Respuesta *</Label>
                <Textarea
                  id="answer"
                  placeholder="Escribe la respuesta completa a la pregunta..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <p className="text-xs text-gray-500">
                  Clasifica la pregunta (ej. Horarios, Precios, Reservaciones). Puedes
                  elegir una existente o crear una nueva.
                </p>
                {!showNewCategory ? (
                  <div className="space-y-2">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecciona una categoría (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewCategory(true)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Nueva Categoría
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nombre de la nueva categoría"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleCreateCategory()
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setShowNewCategory(false)
                          setNewCategoryName('')
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={!newCategoryName.trim()}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Categoría
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Sucursales *</Label>
                  <p className="text-xs text-gray-500">
                    Selecciona la sucursal, las sucursales o todas las sucursales a
                    las que aplica esta pregunta.
                  </p>
                </div>
                {loadingBranches ? (
                  <p className="text-sm text-gray-500">Cargando sucursales...</p>
                ) : branches.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No hay sucursales activas registradas.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="todas-sucursales"
                        checked={branchesSelected.includes('Todas las sucursales')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBranchesSelected(['Todas las sucursales'])
                          } else {
                            setBranchesSelected([])
                          }
                        }}
                      />
                      <Label
                        htmlFor="todas-sucursales"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Todas las sucursales
                      </Label>
                    </div>
                    {!branchesSelected.includes('Todas las sucursales') && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                        {branches.map((branch) => (
                          <div key={branch.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`sucursal-${branch.id}`}
                              checked={branchesSelected.includes(branch.name)}
                              onCheckedChange={() => handleSucursalToggle(branch.name)}
                            />
                            <Label
                              htmlFor={`sucursal-${branch.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {branch.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                    {branchesSelected.length === 0 && (
                      <p className="text-xs text-red-500">
                        Debes seleccionar al menos una sucursal
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is-active" className="cursor-pointer">
                    Base de conocimiento activa
                  </Label>
                  <p className="text-xs text-gray-500">
                    Si la desactivas, la respuesta se conserva pero deja de detectarse
                    en otras plataformas (consumo vía API). Útil para respuestas
                    desactualizadas sin borrarlas.
                  </p>
                </div>
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                <Link href="/admin/base-conocimiento">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Pregunta'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
