'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Image, Users, LogOut, Utensils, HelpCircle, Menu, Zap, Tag, MapPin, PanelTop, Gift, ShoppingCart, BookOpen, Package, Megaphone, Receipt } from 'lucide-react'
import ImageComponent from 'next/image'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAccesoAdmin } from '@/components/admin/admin-access'
import { esRutaDeEdicion, seccionDeRuta, SECCIONES_ADMIN } from '@/lib/admin-permissions'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [postsCount, setPostsCount] = useState(0)
  const [mediaCount, setMediaCount] = useState(0)
  const [menuCount, setMenuCount] = useState(0)
  const [faqCount, setFaqCount] = useState(0)
  const [knowledgeCount, setKnowledgeCount] = useState(0)
  const [attractionsCount, setAttractionsCount] = useState(0)
  const [promotionsCount, setPromotionsCount] = useState(0)
  const [branchesCount, setBranchesCount] = useState(0)
  const [leadsCount, setLeadsCount] = useState(0)
  const [birthdayPackagesCount, setBirthdayPackagesCount] = useState(0)
  const [ordersCount, setOrdersCount] = useState(0)
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [sinPermiso, setSinPermiso] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { esSuper, puedeVer, puedeEditar } = useAccesoAdmin()

  // Si una tarjeta o enlace del panel se muestra según los permisos del usuario.
  // Las rutas fuera de las secciones (blog, sitio) siempre se muestran.
  const permitido = (href: string) => {
    if (href.startsWith('/admin/usuarios')) return esSuper
    const seccion = seccionDeRuta(href)
    if (!seccion) return true
    return esRutaDeEdicion(href) ? puedeEditar(seccion) : puedeVer(seccion)
  }
  const sinSecciones = !esSuper && !SECCIONES_ADMIN.some((s) => puedeVer(s.key))

  useEffect(() => {
    checkAuth()
    fetchStats()
    // El middleware manda aquí con ?sin_permiso=1 al intentar abrir una sección sin acceso.
    if (new URLSearchParams(window.location.search).has('sin_permiso')) {
      setSinPermiso(true)
      router.replace('/admin')
    }
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin/login')
      return
    }
    setUser(user)
  }

  const fetchStats = async () => {
    try {
      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })

      setPostsCount(postsCount || 0)

      // Fetch media count
      const { data: mediaFiles } = await supabase.storage
        .from('media')
        .list('', { limit: 1000 })

      setMediaCount(mediaFiles?.length || 0)

      // Fetch menu count
      const { count: menuItemsCount } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })

      setMenuCount(menuItemsCount || 0)

      // Fetch FAQ count
      const { count: faqsCount } = await supabase
        .from('faqs')
        .select('*', { count: 'exact', head: true })

      setFaqCount(faqsCount || 0)

      // Fetch knowledge base count
      const { count: knowledgeBaseCount } = await supabase
        .from('knowledge_base')
        .select('*', { count: 'exact', head: true })

      setKnowledgeCount(knowledgeBaseCount || 0)

      // Fetch attractions count
      const { count: attractionsCount } = await supabase
        .from('attractions')
        .select('*', { count: 'exact', head: true })

      setAttractionsCount(attractionsCount || 0)

      // Fetch promotions count
      const { count: promotionsCount } = await supabase
        .from('promotions')
        .select('*', { count: 'exact', head: true })

      setPromotionsCount(promotionsCount || 0)

      // Fetch birthday packages count
      const { count: birthdayPackagesCount } = await supabase
        .from('birthday_packages')
        .select('*', { count: 'exact', head: true })

      setBirthdayPackagesCount(birthdayPackagesCount || 0)

      setBranchesCount(branchesCount || 0)

      // Fetch leads count
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      setLeadsCount(leadsCount || 0)

      // Ventas de la tienda en línea (via API: shop_orders solo se lee con service role)
      if (!puedeVer('ventas')) return
      const ordersRes = await fetch('/api/admin/shop-orders')
      if (ordersRes.ok) {
        const orders = await ordersRes.json()
        setOrdersCount(orders.length)
        setOrdersTotal(
          orders.reduce((acc: number, o: any) => acc + (o.amount_total || 0), 0) / 100
        )
      }

    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <ImageComponent
            src="/assets/logojumpin.png"
            alt="Jump-in Trampoline Park Logo"
            width={80}
            height={80}
            data-ai-hint="logo jump"
            className="h-auto flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 truncate">Panel de Administración</h1>
            <p className="text-sm md:text-base text-gray-600 truncate">Bienvenido, {user.email}</p>
          </div>
        </div>

        {/* Botón de menú móvil */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <ImageComponent
                  src="/assets/logojumpin.png"
                  alt="Jump-in Trampoline Park Logo"
                  width={50}
                  height={50}
                  data-ai-hint="logo jump"
                  className="h-auto"
                />
                <span className="text-lg">Panel de Administración</span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4 pb-10">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Usuario</p>
                <p className="text-sm text-gray-700 break-words">{user.email}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 mb-4">Navegación</p>
                {permitido('/admin/posts') && (
                  <Link href="/admin/posts" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Artículos
                    </Button>
                  </Link>
                )}
                {permitido('/admin/media') && (
                  <Link href="/admin/media" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Image className="h-4 w-4 mr-2" />
                      Multimedia
                    </Button>
                  </Link>
                )}
                {permitido('/admin/menu') && (
                  <Link href="/admin/menu" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Utensils className="h-4 w-4 mr-2" />
                      Menú de Alimentos
                    </Button>
                  </Link>
                )}
                {permitido('/admin/faq') && (
                  <Link href="/admin/faq" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Preguntas Frecuentes
                    </Button>
                  </Link>
                )}
                {permitido('/admin/base-conocimiento') && (
                  <Link href="/admin/base-conocimiento" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Base de Conocimiento
                    </Button>
                  </Link>
                )}
                {permitido('/admin/promociones') && (
                  <Link href="/admin/promociones" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Tag className="h-4 w-4 mr-2" />
                      Promociones
                    </Button>
                  </Link>
                )}
                {permitido('/admin/cumpleanos') && (
                  <Link href="/admin/cumpleanos" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Gift className="h-4 w-4 mr-2" />
                      Paquetes Cumpleaños
                    </Button>
                  </Link>
                )}
                {permitido('/admin/atracciones') && (
                  <Link href="/admin/atracciones" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Zap className="h-4 w-4 mr-2" />
                      Atracciones
                    </Button>
                  </Link>
                )}
                {permitido('/admin/sucursales') && (
                  <Link href="/admin/sucursales" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Sucursales
                    </Button>
                  </Link>
                )}
                {permitido('/admin/popup') && (
                  <Link href="/admin/popup" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <PanelTop className="h-4 w-4 mr-2" />
                      Popup del Sitio
                    </Button>
                  </Link>
                )}
                {permitido('/admin/banner') && (
                  <Link href="/admin/banner" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Megaphone className="h-4 w-4 mr-2" />
                      Banner Superior
                    </Button>
                  </Link>
                )}
                {permitido('/admin/articulos') && (
                  <Link href="/admin/articulos" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Artículos (Shop)
                    </Button>
                  </Link>
                )}
                {permitido('/admin/shop') && (
                  <Link href="/admin/shop" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Shop — Fechas
                    </Button>
                  </Link>
                )}
                {permitido('/admin/ventas') && (
                  <Link href="/admin/ventas" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Receipt className="h-4 w-4 mr-2" />
                      Ventas en Línea
                    </Button>
                  </Link>
                )}
                {permitido('/admin/usuarios') && (
                  <Link href="/admin/usuarios" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Usuarios
                    </Button>
                  </Link>
                )}
                {permitido('/admin/leads') && (
                  <Link href="/admin/leads" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Gift className="h-4 w-4 mr-2" />
                      Registros (Leads)
                    </Button>
                  </Link>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 mb-4">Enlaces</p>
                <Link href="/blog" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Blog Público
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Ver Sitio Web
                  </Button>
                </Link>
              </div>
              <Separator />
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Botón de cerrar sesión en desktop */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="hidden md:flex"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      {sinPermiso && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            No tienes permiso para abrir esa sección. Si lo necesitas, pídeselo a un super administrador.
          </AlertDescription>
        </Alert>
      )}

      {sinSecciones && (
        <Alert className="mb-6">
          <AlertDescription>
            Tu usuario todavía no tiene secciones asignadas. Pide a un super administrador que te dé
            permisos desde la sección Usuarios.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Posts Card */}
        {permitido('/admin/posts') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artículos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postsCount}</div>
              <p className="text-xs text-muted-foreground">
                artículos publicados
              </p>
              <Link href="/admin/posts" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Artículos
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Media Card */}
        {permitido('/admin/media') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Multimedia</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaCount}</div>
              <p className="text-xs text-muted-foreground">
                archivos subidos
              </p>
              <Link href="/admin/media" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Multimedia
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Menu Card */}
        {permitido('/admin/menu') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menú de Alimentos</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuCount}</div>
              <p className="text-xs text-muted-foreground">platillos publicados</p>
              <Link href="/admin/menu" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Menú
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* FAQ Card */}
        {permitido('/admin/faq') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preguntas Frecuentes</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{faqCount}</div>
              <p className="text-xs text-muted-foreground">preguntas publicadas</p>
              <Link href="/admin/faq" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar FAQs
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Knowledge Base Card */}
        {permitido('/admin/base-conocimiento') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Base de Conocimiento</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{knowledgeCount}</div>
              <p className="text-xs text-muted-foreground">preguntas registradas</p>
              <Link href="/admin/base-conocimiento" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Base de Conocimiento
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Attractions Card */}
        {permitido('/admin/atracciones') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atracciones</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attractionsCount}</div>
              <p className="text-xs text-muted-foreground">atracciones publicadas</p>
              <Link href="/admin/atracciones" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Atracciones
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Promotions Card */}
        {permitido('/admin/promociones') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promociones</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promotionsCount}</div>
              <p className="text-xs text-muted-foreground">promociones publicadas</p>
              <Link href="/admin/promociones" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Promociones
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Birthday Packages Card */}
        {permitido('/admin/cumpleanos') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paquetes Cumpleaños</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{birthdayPackagesCount}</div>
              <p className="text-xs text-muted-foreground">paquetes publicados</p>
              <Link href="/admin/cumpleanos" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Paquetes
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Branches Card */}
        {permitido('/admin/sucursales') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sucursales</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branchesCount}</div>
              <p className="text-xs text-muted-foreground">sucursales registradas</p>
              <Link href="/admin/sucursales" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Sucursales
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Popup Card */}
        {permitido('/admin/popup') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Popup del Sitio</CardTitle>
              <PanelTop className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">configuración del popup</p>
              <Link href="/admin/popup" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Popup
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Banner Card */}
        {permitido('/admin/banner') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banner Superior</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">banner de la página de inicio</p>
              <Link href="/admin/banner" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Banner
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Users Card */}
        {permitido('/admin/usuarios') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                usuarios administradores
              </p>
              <Link href="/admin/usuarios" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Usuarios
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Ventas en Línea Card */}
        {permitido('/admin/ventas') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas en Línea</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordersCount}</div>
              <p className="text-xs text-muted-foreground">
                {ordersTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} vendidos
              </p>
              <Link href="/admin/ventas" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Ver Ventas
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Articulos (Stripe) Card */}
        {permitido('/admin/articulos') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artículos (Shop)</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">productos de Stripe</p>
              <Link href="/admin/articulos" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Artículos
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Shop Card */}
        {permitido('/admin/shop') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shop — Fechas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">restricciones de calendario</p>
              <Link href="/admin/shop" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Gestionar Shop
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Leads Card */}
        {permitido('/admin/leads') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registros (Leads)</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadsCount}</div>
              <p className="text-xs text-muted-foreground">
                personas registradas
              </p>
              <Link href="/admin/leads" className="mt-4 block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Ver Registros
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accede rápidamente a las funciones más comunes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permitido('/admin/posts/new') && (
              <Link href="/admin/posts/new">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Crear Nuevo Artículo
                </Button>
              </Link>
            )}
            {permitido('/admin/media') && (
              <Link href="/admin/media">
                <Button className="w-full justify-start" variant="outline">
                  <Image className="h-4 w-4 mr-2" />
                  Subir Archivo Multimedia
                </Button>
              </Link>
            )}
            {permitido('/admin/menu') && (
              <Link href="/admin/menu">
                <Button className="w-full justify-start" variant="outline">
                  <Utensils className="h-4 w-4 mr-2" />
                  Gestionar Menú
                </Button>
              </Link>
            )}
            {permitido('/admin/faq/new') && (
              <Link href="/admin/faq/new">
                <Button className="w-full justify-start" variant="outline">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Crear Nueva Pregunta
                </Button>
              </Link>
            )}
            {permitido('/admin/base-conocimiento/new') && (
              <Link href="/admin/base-conocimiento/new">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Agregar a Base de Conocimiento
                </Button>
              </Link>
            )}
            {permitido('/admin/atracciones') && (
              <Link href="/admin/atracciones">
                <Button className="w-full justify-start" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Gestionar Atracciones
                </Button>
              </Link>
            )}
            {permitido('/admin/promociones') && (
              <Link href="/admin/promociones">
                <Button className="w-full justify-start" variant="outline">
                  <Tag className="h-4 w-4 mr-2" />
                  Gestionar Promociones
                </Button>
              </Link>
            )}
            {permitido('/admin/cumpleanos') && (
              <Link href="/admin/cumpleanos">
                <Button className="w-full justify-start" variant="outline">
                  <Gift className="h-4 w-4 mr-2" />
                  Gestionar Paquetes Cumpleaños
                </Button>
              </Link>
            )}
            {permitido('/admin/sucursales') && (
              <Link href="/admin/sucursales">
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Gestionar Sucursales
                </Button>
              </Link>
            )}
            {permitido('/admin/popup') && (
              <Link href="/admin/popup">
                <Button className="w-full justify-start" variant="outline">
                  <PanelTop className="h-4 w-4 mr-2" />
                  Configurar Popup
                </Button>
              </Link>
            )}
            {permitido('/admin/banner') && (
              <Link href="/admin/banner">
                <Button className="w-full justify-start" variant="outline">
                  <Megaphone className="h-4 w-4 mr-2" />
                  Configurar Banner Superior
                </Button>
              </Link>
            )}
            {permitido('/admin/shop') && (
              <Link href="/admin/shop">
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Shop — Control de Fechas
                </Button>
              </Link>
            )}
            {permitido('/admin/ventas') && (
              <Link href="/admin/ventas">
                <Button className="w-full justify-start" variant="outline">
                  <Receipt className="h-4 w-4 mr-2" />
                  Ver Ventas en Línea
                </Button>
              </Link>
            )}
            {permitido('/admin/usuarios') && (
              <Link href="/admin/usuarios">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Usuarios
                </Button>
              </Link>
            )}
            <Link href="/blog">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Ver Blog Público
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Ver Sitio Web
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
