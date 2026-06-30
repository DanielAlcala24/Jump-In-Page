'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Save, ChevronDown, ChevronUp, LucideIcon } from 'lucide-react'

interface ExternalKnowledgeItem {
  id: string
  name: string
  knowledge_base: string | null
  knowledge_category: string | null
  knowledge_is_active: boolean
}

interface ExternalKnowledgeSectionProps {
  /** Nombre de la tabla en Supabase (ej. "attractions") */
  table: string
  /** Título de la sección */
  title: string
  /** Descripción de la sección */
  description: string
  /** Campo que contiene el nombre/título del registro (ej. "name" o "title") */
  nameField: string
  /** Icono de lucide para la sección */
  icon: LucideIcon
}

export default function ExternalKnowledgeSection({
  table,
  title,
  description,
  nameField,
  icon: Icon
}: ExternalKnowledgeSectionProps) {
  const supabase = createClientComponentClient()
  const [items, setItems] = useState<ExternalKnowledgeItem[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [categoryDrafts, setCategoryDrafts] = useState<Record<string, string>>({})
  const [activeDrafts, setActiveDrafts] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Categorías ya usadas en esta tabla, para sugerirlas al editar.
  const usedCategories = Array.from(
    new Set(
      items
        .map((item) => item.knowledge_category)
        .filter((cat): cat is string => Boolean(cat))
    )
  ).sort((a, b) => a.localeCompare(b))

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from(table)
          .select(`id, ${nameField}, knowledge_base, knowledge_category, knowledge_is_active`)
          .order(nameField, { ascending: true })

        if (error) {
          console.error(`Error fetching ${table}:`, error)
          setError('No se pudo cargar la información')
          return
        }

        const mapped: ExternalKnowledgeItem[] = (data || []).map((row: any) => ({
          id: row.id,
          name: row[nameField] || '(sin nombre)',
          knowledge_base: row.knowledge_base,
          knowledge_category: row.knowledge_category,
          knowledge_is_active: row.knowledge_is_active ?? true
        }))

        setItems(mapped)
        setDrafts(
          Object.fromEntries(mapped.map((item) => [item.id, item.knowledge_base || '']))
        )
        setCategoryDrafts(
          Object.fromEntries(
            mapped.map((item) => [item.id, item.knowledge_category || ''])
          )
        )
        setActiveDrafts(
          Object.fromEntries(
            mapped.map((item) => [item.id, item.knowledge_is_active])
          )
        )
      } catch (err) {
        console.error('Error:', err)
        setError('No se pudo cargar la información')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, nameField])

  const handleSave = async (id: string) => {
    setSavingId(id)
    const value = drafts[id]?.trim() ? drafts[id].trim() : null
    const categoryValue = categoryDrafts[id]?.trim() ? categoryDrafts[id].trim() : null
    const activeValue = activeDrafts[id] ?? true

    try {
      const { error } = await supabase
        .from(table)
        .update({
          knowledge_base: value,
          knowledge_category: categoryValue,
          knowledge_is_active: activeValue
        })
        .eq('id', id)

      if (error) {
        console.error('Error saving knowledge_base:', error)
        toast.error('Error al guardar la base de conocimiento')
        return
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                knowledge_base: value,
                knowledge_category: categoryValue,
                knowledge_is_active: activeValue
              }
            : item
        )
      )
      toast.success('Base de conocimiento actualizada')
    } catch (err) {
      console.error('Error:', err)
      toast.error('Error al guardar la base de conocimiento')
    } finally {
      setSavingId(null)
    }
  }

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const isDirty = (item: ExternalKnowledgeItem) =>
    (drafts[item.id] ?? '') !== (item.knowledge_base ?? '') ||
    (categoryDrafts[item.id] ?? '') !== (item.knowledge_category ?? '') ||
    (activeDrafts[item.id] ?? true) !== item.knowledge_is_active

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-orange-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-red-600">{error}</p>}

        <datalist id={`categories-${table}`}>
          {usedCategories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>

        {loading ? (
          <div className="text-center py-6 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-sm">Cargando...</p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No hay registros para mostrar.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const isOpen = expanded[item.id]
              const hasKnowledge = Boolean(item.knowledge_base?.trim())

              return (
                <div key={item.id} className="rounded-lg border">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.id)}
                    className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                  >
                    <span className="flex flex-wrap items-center gap-2 font-medium text-gray-900">
                      {item.name}
                      <Badge
                        variant="outline"
                        className={
                          hasKnowledge
                            ? 'bg-green-100 text-green-800 border-green-300 font-normal'
                            : 'bg-gray-100 text-gray-600 border-gray-300 font-normal'
                        }
                      >
                        {hasKnowledge ? 'Con información' : 'Sin información'}
                      </Badge>
                      {item.knowledge_category && (
                        <Badge variant="outline" className="font-normal">
                          {item.knowledge_category}
                        </Badge>
                      )}
                      {!item.knowledge_is_active && (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-600 border-gray-300 font-normal"
                        >
                          Inactiva
                        </Badge>
                      )}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="space-y-3 border-t px-4 py-3">
                      <div className="space-y-1">
                        <Label htmlFor={`category-${item.id}`} className="text-sm">
                          Categoría
                        </Label>
                        <Input
                          id={`category-${item.id}`}
                          list={`categories-${table}`}
                          value={categoryDrafts[item.id] ?? ''}
                          onChange={(e) =>
                            setCategoryDrafts((prev) => ({
                              ...prev,
                              [item.id]: e.target.value
                            }))
                          }
                          placeholder="Ej. Horarios, Precios, Reservaciones (opcional)"
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5 pr-3">
                          <Label htmlFor={`active-${item.id}`} className="text-sm cursor-pointer">
                            Base de conocimiento activa
                          </Label>
                          <p className="text-xs text-gray-500">
                            Si la desactivas, el contenido se conserva pero deja de
                            detectarse en otras plataformas (consumo vía API).
                          </p>
                        </div>
                        <Switch
                          id={`active-${item.id}`}
                          checked={activeDrafts[item.id] ?? true}
                          onCheckedChange={(checked) =>
                            setActiveDrafts((prev) => ({ ...prev, [item.id]: checked }))
                          }
                        />
                      </div>
                      <Textarea
                        value={drafts[item.id] ?? ''}
                        onChange={(e) =>
                          setDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        placeholder="Información interna (no se muestra en el sitio público, se consume vía API)"
                        rows={6}
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleSave(item.id)}
                          disabled={!isDirty(item) || savingId === item.id}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {savingId === item.id ? 'Guardando...' : 'Guardar'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
