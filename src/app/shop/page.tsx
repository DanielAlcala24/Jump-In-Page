'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsappButton from '@/components/whatsapp-button'
import SocialIcons from '@/components/social-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ShoppingCart, Calendar, ArrowLeft, Loader2, Tag, Ticket, Package, Plus, Minus, Trash2 } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { es } from 'date-fns/locale'
import { format, isBefore, startOfDay, parseISO, isWithinInterval } from 'date-fns'
import 'react-day-picker/dist/style.css'
import Image from 'next/image'

interface Branch {
  id: string
  name: string
  slug: string
  state?: string
  featured_image?: string
}

interface Product {
  id: string
  name: string
  description: string | null
  image: string | null
  price_id: string | null
  unit_amount: number | null
  currency: string
  product_type: 'access' | 'article' | 'promotion'
  branch_id: string | null
}

interface CartItem {
  product: Product
  quantity: number
}

interface DateRestriction {
  id: string
  stripe_product_id: string
  restriction_type: 'allowed_weekdays' | 'blocked_dates' | 'blocked_date_range'
  allowed_weekdays: number[] | null
  blocked_dates: string[] | null
  start_date: string | null
  end_date: string | null
}

type Step = 'branch' | 'products' | 'date' | 'confirm'

const TYPE_ICONS = { access: Ticket, article: Package, promotion: Tag }
const TYPE_LABELS = { access: 'Acceso', article: 'Artículo', promotion: 'Promoción' }
const TYPE_COLORS = {
  access: 'bg-orange-100 text-orange-700',
  article: 'bg-blue-100 text-blue-700',
  promotion: 'bg-green-100 text-green-700',
}

export default function ShopPage() {
  const [step, setStep] = useState<Step>('branch')
  const [branches, setBranches] = useState<Branch[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [restrictions, setRestrictions] = useState<DateRestriction[]>([])
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [cart, setCart] = useState<Record<string, CartItem>>({})
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [loadingBranches, setLoadingBranches] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    supabase
      .from('branches')
      .select('id, name, slug, state, featured_image')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => { setBranches(data ?? []); setLoadingBranches(false) })
  }, [supabase])

  const loadProducts = useCallback(async (branchId: string) => {
    setLoadingProducts(true)
    const res = await fetch(`/api/stripe/products?branch_id=${branchId}`)
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
    setLoadingProducts(false)
  }, [])

  // Load restrictions for all access items in the cart (union of all)
  const loadRestrictionsForCart = useCallback(async (cartItems: Record<string, CartItem>, branchId: string) => {
    const accessIds = Object.values(cartItems)
      .filter((i) => i.product.product_type === 'access')
      .map((i) => i.product.id)

    if (accessIds.length === 0) { setRestrictions([]); return }

    const results = await Promise.all(
      accessIds.map((id) =>
        fetch(`/api/shop/date-restrictions?product_id=${id}&branch_id=${branchId}`).then((r) => r.json())
      )
    )
    setRestrictions(results.flat().filter(Boolean))
  }, [])

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch)
    setCart({})
    setSelectedDate(undefined)
    setStep('products')
    loadProducts(branch.id)
  }

  const addToCart = (product: Product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: { product, quantity: (prev[product.id]?.quantity ?? 0) + 1 },
    }))
  }

  const removeFromCart = (product: Product) => {
    setCart((prev) => {
      const current = prev[product.id]?.quantity ?? 0
      if (current <= 1) {
        const next = { ...prev }
        delete next[product.id]
        return next
      }
      return { ...prev, [product.id]: { product, quantity: current - 1 } }
    })
  }

  const cartItems = Object.values(cart)
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.product.unit_amount ?? 0) * i.quantity, 0)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const hasAccessItems = cartItems.some((i) => i.product.product_type === 'access')
  const currency = cartItems[0]?.product.currency ?? 'mxn'

  const handleGoToCheckout = async () => {
    if (hasAccessItems) {
      await loadRestrictionsForCart(cart, selectedBranch!.id)
      setSelectedDate(undefined)
      setStep('date')
    } else {
      setStep('confirm')
    }
  }

  const handleCheckout = async () => {
    if (!selectedBranch || cartItems.length === 0) return
    setLoadingCheckout(true)

    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems.map((i) => ({ price_id: i.product.price_id, quantity: i.quantity, name: i.product.name })),
        branch_id: selectedBranch.id,
        branch_name: selectedBranch.name,
        visit_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Error al iniciar el pago. Por favor intenta de nuevo.')
      setLoadingCheckout(false)
    }
  }

  const isDateDisabled = useCallback((date: Date): boolean => {
    if (isBefore(date, startOfDay(new Date()))) return true
    for (const r of restrictions) {
      if (r.restriction_type === 'allowed_weekdays' && r.allowed_weekdays?.length) {
        if (!r.allowed_weekdays.includes(date.getDay())) return true
      }
      if (r.restriction_type === 'blocked_dates' && r.blocked_dates?.length) {
        if (r.blocked_dates.includes(format(date, 'yyyy-MM-dd'))) return true
      }
      if (r.restriction_type === 'blocked_date_range' && r.start_date && r.end_date) {
        if (isWithinInterval(date, { start: parseISO(r.start_date), end: parseISO(r.end_date) })) return true
      }
    }
    return false
  }, [restrictions])

  const formatPrice = (amount: number | null, cur?: string) => {
    if (amount === null) return 'Consultar precio'
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: (cur ?? currency).toUpperCase(),
    }).format(amount / 100)
  }

  const steps: Step[] = ['branch', 'products', 'date', 'confirm']
  const stepLabels = { branch: 'Sucursal', products: 'Productos', date: 'Fecha', confirm: 'Pago' }
  const currentIdx = steps.indexOf(step)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SocialIcons />
      <main className="flex-1 bg-gray-50 pb-32">
        {/* Hero */}
        <section className="bg-orange-500 text-white py-14 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline mb-3">Compra tu acceso</h1>
          <p className="text-orange-100 text-lg max-w-xl mx-auto">
            Elige tu sucursal, agrega lo que quieras al carrito y paga de forma segura.
          </p>
        </section>

        {/* Stepper */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {steps.map((s, i) => {
              const done = i < currentIdx
              const active = s === step
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${active ? 'bg-orange-500 text-white' : done ? 'bg-orange-200 text-orange-800' : 'bg-white text-gray-400 border'}`}>
                    <span>{i + 1}.</span>
                    <span>{stepLabels[s]}</span>
                  </div>
                  {i < steps.length - 1 && <div className="w-6 h-px bg-gray-300" />}
                </div>
              )
            })}
          </div>

          {/* STEP 1 — Sucursal */}
          {step === 'branch' && (
            <div>
              <h2 className="text-2xl font-bold font-headline mb-6 text-center">¿A qué sucursal vas a ir?</h2>
              {loadingBranches ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {branches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => handleSelectBranch(branch)}
                      className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-500 text-left"
                    >
                      <div className="relative h-40 bg-gray-100">
                        <Image src={branch.featured_image || '/assets/g1.jpg'} alt={branch.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                          <p className="text-xs text-gray-500">{branch.state}</p>
                        </div>
                        <h3 className="font-bold text-gray-900 font-headline mt-1">{branch.name}</h3>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Productos con carrito */}
          {step === 'products' && (
            <div>
              <button onClick={() => setStep('branch')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-4 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Cambiar sucursal
              </button>
              <h2 className="text-2xl font-bold font-headline mb-2 text-center">
                Productos en <span className="text-orange-500">{selectedBranch?.name}</span>
              </h2>
              <p className="text-gray-500 text-center mb-6 text-sm">Agrega los productos que deseas al carrito.</p>

              {loadingProducts ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 text-gray-400">No hay productos disponibles para esta sucursal en este momento.</div>
              ) : (
                <div>
                  {(['access', 'promotion', 'article'] as const).map((type) => {
                    const group = products.filter((p) => p.product_type === type)
                    if (group.length === 0) return null
                    const Icon = TYPE_ICONS[type]
                    return (
                      <div key={type} className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <Icon className="h-5 w-5 text-orange-500" />
                          <h3 className="text-lg font-bold font-headline">{TYPE_LABELS[type]}s</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.map((product) => {
                            const qty = cart[product.id]?.quantity ?? 0
                            return (
                              <div
                                key={product.id}
                                className={`bg-white rounded-xl overflow-hidden shadow transition-all flex flex-col border-2
                                  ${qty > 0 ? 'border-orange-500' : 'border-transparent'}`}
                              >
                                {product.image && (
                                  <div className="relative h-36 bg-gray-100">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    {qty > 0 && (
                                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
                                        {qty}
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="p-4 flex-1 flex flex-col">
                                  <Badge className={`${TYPE_COLORS[type]} text-xs w-fit mb-2`}>{TYPE_LABELS[type]}</Badge>
                                  <h4 className="font-bold text-gray-900 font-headline">{product.name}</h4>
                                  {product.description && <p className="text-gray-500 text-sm mt-1 flex-1 line-clamp-2">{product.description}</p>}
                                  <div className="mt-3 pt-3 border-t flex items-center justify-between gap-2">
                                    <span className="text-lg font-extrabold text-orange-500">{formatPrice(product.unit_amount, product.currency)}</span>
                                    {qty === 0 ? (
                                      <Button
                                        size="sm"
                                        onClick={() => addToCart(product)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white h-8 px-3"
                                      >
                                        <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
                                      </Button>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => removeFromCart(product)}
                                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors"
                                        >
                                          {qty === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                                        </button>
                                        <span className="w-6 text-center font-bold text-gray-900">{qty}</span>
                                        <button
                                          onClick={() => addToCart(product)}
                                          className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                                        >
                                          <Plus className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Fecha */}
          {step === 'date' && (
            <div>
              <button onClick={() => setStep('products')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-4 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Volver a productos
              </button>
              <h2 className="text-2xl font-bold font-headline mb-2 text-center">
                ¿Qué día vas a visitar <span className="text-orange-500">{selectedBranch?.name}</span>?
              </h2>
              <p className="text-gray-500 text-center mb-6 text-sm">Selecciona la fecha de tu visita. Los días desactivados no están disponibles para los accesos que elegiste.</p>

              <div className="flex flex-col items-center gap-6">
                <div className="bg-white rounded-xl shadow p-4 border">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    locale={es}
                    fromDate={new Date()}
                  />
                </div>
                {selectedDate && (
                  <Button onClick={() => setStep('confirm')} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base">
                    <Calendar className="mr-2 h-4 w-4" />
                    Continuar para el {format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 — Confirmación */}
          {step === 'confirm' && (
            <div className="max-w-md mx-auto">
              <button onClick={() => setStep(hasAccessItems ? 'date' : 'products')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-4 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Regresar
              </button>
              <h2 className="text-2xl font-bold font-headline mb-6 text-center">Resumen de tu compra</h2>

              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">Sucursal</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-bold text-gray-900">{selectedBranch?.name}</p>
                  {selectedDate && (
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                      {format(selectedDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">Productos ({cartCount})</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-semibold text-sm text-gray-900 truncate">{item.product.name}</p>
                        <Badge className={`${TYPE_COLORS[item.product.product_type]} text-xs mt-0.5`}>
                          {TYPE_LABELS[item.product.product_type]}
                        </Badge>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.product.unit_amount, item.product.currency)}</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {formatPrice((item.product.unit_amount ?? 0) * item.quantity, item.product.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-extrabold text-orange-500">{formatPrice(cartTotal)}</span>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-gray-400 text-center mb-4">
                Al continuar serás redirigido a Stripe para ingresar tu correo y datos de pago de forma segura.
              </p>

              <Button onClick={handleCheckout} disabled={loadingCheckout} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-bold">
                {loadingCheckout
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Redirigiendo...</>
                  : <><ShoppingCart className="mr-2 h-5 w-5" /> Ir a pagar con Stripe</>}
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Floating cart bar — visible on products step when cart has items */}
      {step === 'products' && cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900">{cartCount} {cartCount === 1 ? 'producto' : 'productos'}</p>
              <p className="text-orange-500 font-extrabold text-lg">{formatPrice(cartTotal)}</p>
            </div>
            <Button onClick={handleGoToCheckout} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-bold">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Continuar
            </Button>
          </div>
        </div>
      )}

      <style>{`
        .rdp-selected .rdp-day_button {
          background-color: #f97316 !important;
          color: white !important;
        }
        .rdp-day_button:hover:not([disabled]) {
          background-color: #fed7aa !important;
        }
      `}</style>

      <WhatsappButton />
      <Footer />
    </div>
  )
}
