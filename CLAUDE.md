# Jump-In — Contexto del proyecto para agentes de IA

## Negocio

Jump-In es una cadena de **parques de trampolines (trampoline park)** en México. El sitio público está en **https://jumpin.com.mx**. Tiene múltiples sucursales, dos mascotas llamadas **Bongo** y **Maya**, y el color de marca principal es **naranja (orange-500)**. Redes sociales: Facebook `JumpInMexico`, Instagram `jumpinmexico`.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14+ con App Router (TypeScript) |
| Estilos | Tailwind CSS + shadcn/ui (`src/components/ui/`) |
| Base de datos / Auth / Storage | Supabase |
| Tipografías | Poppins (`font-headline`) · PT Sans (`font-body`) |
| IA generativa (interna) | Genkit (`src/ai/`) |

**Variables de entorno necesarias (crear `.env.local`):**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://jumpin.com.mx
```

**Clientes Supabase:**
- Server Components → `createServerComponentClient()` en `src/lib/supabase-server.ts`
- Client Components → `createClientComponentClient()` en `src/lib/supabase.ts`

---

## Analytics / Marketing integrados

| Herramienta | ID |
|-------------|-----|
| Google Tag Manager | GTM-PFWMMNBZ |
| Google Analytics 4 | G-7VFM1S3HZN |
| Google Ads | AW-16651738395 |
| Microsoft Clarity | lxqed18ama |
| HubSpot (chat/CRM) | cuenta 48545315 |

Todos se cargan en `src/app/layout.tsx`.

---

## Páginas públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/atracciones` | Listado de atracciones |
| `/fiestas-y-eventos/fiestas-cumpleanos` | Fiestas de cumpleaños con paquetes |
| `/fiestas-y-eventos/eventos-empresariales` | Eventos corporativos |
| `/menu-alimentos` | Menú de alimentos |
| `/precios-y-promociones` | Precios y promociones |
| `/galeria` | Galería de fotos |
| `/sucursales` | Lista de sucursales |
| `/sucursales/[slug]` | Detalle de una sucursal |
| `/nosotros` | Quiénes somos |
| `/compromiso-social` | Compromiso social |
| `/blog` | Blog |
| `/blog/[slug]` | Artículo individual |
| `/facturacion` | Facturación |
| `/aviso-de-privacidad` | Aviso de privacidad |
| `/terminos-y-condiciones` | Términos y condiciones |
| `/casafutbol` | Colaboración Jump-In × Casa Fútbol |
| `/shop` | Tienda en línea (compra de entradas y artículos) |
| `/shop/success` | Confirmación de compra con el QR del ticket |

---

## Panel de administración (`/admin/...`)

Requiere autenticación Supabase. Login en `/admin/login`, **solo con Google** (no hay correo/contraseña).

El botón llama a `signInWithOAuth({ provider: 'google' })` y regresa a `GET /api/auth/callback`, que canjea el code por sesión (PKCE) y **verifica que el correo ya estuviera dado de alta como admin**; si no, cierra la sesión y regresa a `/admin/login?error=no_autorizado`. La barrera principal es el ajuste **"Allow new users to sign up" apagado** en Supabase (sin él, cualquier cuenta de Google entraría, porque Supabase da de alta al usuario en su primer login); la verificación del callback es la segunda barrera. Pasos de configuración de Google Cloud y Supabase: **`google-oauth-setup.md`**.

Ojo con el callback: `exchangeCodeForSession` y `signOut` escriben cookies sobre el objeto `NextResponse`, así que al rechazar hay que devolver **ese mismo objeto** cambiándole el `location`, no uno nuevo, o la sesión rechazada se queda viva en el navegador.

**Alta de admins:** `/admin/usuarios` → `POST /api/admin/create-user`, que usa `admin.createUser({ email, email_confirm: true })`. **No se envía ningún correo** y la cuenta nace sin contraseña: la persona entra directo con "Continuar con Google". El `email_confirm: true` es imprescindible — Google solo se enlaza con cuentas cuyo correo está confirmado, así que una cuenta sin confirmar no podría entrar por ningún medio.

Se eliminaron el flujo de invitación (`inviteUserByEmail`) y la página `/admin/set-password`, junto con su excepción en el middleware.

### Permisos por sección

Cada admin es **super administrador** (ve y edita todo y es el único que administra usuarios) o tiene **permisos personalizados**: por sección, *Sin acceso* / *Ver* / *Ver y editar*. Se asignan al dar de alta o con el botón de la llave en `/admin/usuarios` (`PATCH /api/admin/update-user`). Un super no puede cambiar sus propios permisos ni borrarse, así siempre queda al menos uno.

- Se guardan en el **`app_metadata`** del usuario de Supabase Auth (`admin_role: 'super' | 'custom'`, `admin_permissions: { posts: 'edit', ventas: 'view', … }`), que solo escribe la service role. **Sin `admin_role` = super**: así quedaron los admins que existían antes.
- Lista de secciones, claves y helpers: **`src/lib/admin-permissions.ts`** (`SECCIONES_ADMIN`). Una sección nueva del panel hay que agregarla ahí **y** en el mapeo de tablas de `supabase-admin-permissions.sql`. Ventas es solo lectura para todos.
- Se aplican en 4 capas: **middleware** (sin *Ver* no se abre la sección; sin *Editar* no se abren `/new` ni `/edit`; `/admin/usuarios` solo super) · **rutas API** (`requireAdmin(seccion, nivel)` / `requireSuperAdmin()` de `src/lib/admin-auth.ts`) · **UI** (`src/app/admin/layout.tsx` carga los permisos en un contexto; `<SoloEditores>` oculta botones, `<BloqueEditable>` deshabilita formularios, y sale una franja de "solo lectura") · **RLS** en Supabase (`supabase-admin-permissions.sql`), que es la barrera real porque el panel escribe directo desde el navegador.
- El SQL usa políticas **RESTRICTIVE** (se suman con AND a las existentes, no hay que borrarlas) y la función `admin_puede(seccion, nivel)` lee `auth.users` en cada consulta, así que un cambio de permisos aplica de inmediato. El bucket `media` deja subir a quien edite cualquier sección (los formularios suben imágenes) y borrar solo a quien edite Multimedia.
- Excepciones a propósito: el UPDATE de `attractions`, `promotions`, `birthday_packages` y `menu_items` también lo permite *Editar* de Base de conocimiento (ahí se editan sus campos `knowledge_*`); el INSERT de `leads` no se limita (lo usa el formulario público).

#### ✅ Checklist obligatorio al crear una sección nueva en `/admin`

Toda sección nueva del panel **tiene que** quedar bajo los permisos *Ver* / *Editar*. Si se salta un paso, la sección queda abierta a todos los admins o, al revés, nadie con permisos personalizados la puede usar. Pasos, con `clave` = identificador corto de la sección (p. ej. `'cupones'`):

1. **Registrar la sección** en `SECCIONES_ADMIN` (`src/lib/admin-permissions.ts`): `{ key: 'clave', label: 'Nombre visible', path: '/admin/ruta' }`. Si solo se consulta y no hay nada que editar, agregar `soloLectura: true`. Con este paso ya quedan solos:
   - la fila de la sección en el editor de permisos de `/admin/usuarios` (alta y edición);
   - el bloqueo en el middleware: sin *Ver* no se abre `/admin/ruta` ni sus subrutas, y sin *Editar* no se abren `/admin/ruta/new` ni `/admin/ruta/[id]/edit`;
   - la franja de "solo lectura" para quien solo tiene *Ver*.
2. **Rutas de alta y edición con los nombres `/new` y `/[id]/edit`.** El middleware las reconoce por esos nombres (`esRutaDeEdicion`). Si una pantalla de edición se llama de otra forma, el middleware no la bloquea.
3. **Dashboard** (`src/app/admin/page.tsx`): envolver la tarjeta, el enlace del menú móvil y la acción rápida con `{permitido('/admin/ruta') && (...)}`. Si la tarjeta lee conteos de una API protegida, pedirlos solo `if (puedeVer('clave'))`.
4. **Página de la sección:** envolver cada botón de crear, editar, eliminar, reordenar o activar con `<SoloEditores>` (y la columna "Acciones" de la tabla, encabezado y celda). Los formularios de una sola pantalla van dentro de `<BloqueEditable>`. Un `Switch` o botón que se deba ver pero no usar lleva `disabled={!puedeEditar}`, con `const puedeEditar = usePuedeEditar()`. Todo se importa de `@/components/admin/admin-access`, y el hook toma la sección de la ruta actual.
5. **Controles que escriben en la tabla de otra sección** (como el gestor de sucursales dentro de Promociones): `<SoloEditores seccion="otra-clave">`.
6. **Rutas API nuevas en `/api/admin/...`:** proteger cada handler con `requireAdmin('clave', 'view')` para leer o `requireAdmin('clave', 'edit')` para escribir (`src/lib/admin-auth.ts`), así: `const { respuesta } = await requireAdmin('clave', 'edit'); if (respuesta) return respuesta`. **No usar `getAdminUser` a secas**: solo comprueba que haya sesión. Lo que administre usuarios usa `requireSuperAdmin()`.
7. **RLS en Supabase:** agregar `('tabla', 'clave')` a la lista `VALUES` de `supabase-admin-permissions.sql`, una fila por cada tabla que escriba la sección, y **volver a correr el archivo completo** en el SQL Editor (se puede correr las veces que sea). La tabla nueva sigue necesitando su política permisiva normal para `authenticated` (las RESTRICTIVE solo restringen; sin una permisiva no pasa nada). Dos casos especiales:
   - si la tabla recibe INSERT desde el sitio público, excluirla del INSERT, como `leads`;
   - si guarda datos personales, agregarle también la restricción de SELECT, como `leads`.
8. **Usuarios existentes:** los super ven la sección nueva sin hacer nada. Los de permisos personalizados empiezan *Sin acceso*, hasta que un super se la asigne con la llave 🔑 en `/admin/usuarios`. No hace falta migración.

⚠️ **No renombrar la `key` de una sección existente.** Los permisos guardados en `app_metadata` y las políticas del SQL usan esa clave: si se renombra, todos los usuarios personalizados pierden el acceso a esa sección. Si de verdad hay que renombrarla, también hay que actualizar el `admin_permissions` de cada usuario y el SQL.

| Sección | Ruta | Tabla Supabase | Clave de permiso |
|---------|------|----------------|------------------|
| Dashboard | `/admin` | — | — (todos; muestra solo lo permitido) |
| Artículos (Blog) | `/admin/posts` | `posts` | `posts` |
| Multimedia | `/admin/media` | Storage bucket `media` (+ `media_metadata`) | `media` |
| Menú de alimentos | `/admin/menu` | `menu_items`, `menu_categories` | `menu` |
| Preguntas frecuentes | `/admin/faq` | `faqs` | `faq` |
| Base de conocimiento | `/admin/base-conocimiento` | `knowledge_base` | `base-conocimiento` |
| Atracciones | `/admin/atracciones` | `attractions` | `atracciones` |
| Sucursales | `/admin/sucursales` | `branches` | `sucursales` |
| Artículos (Shop/Stripe) | `/admin/articulos` | Productos de Stripe (API) | `articulos` |
| Grupos de productos (Shop) | `/admin/articulos/grupos` | `shop_product_groups` | `articulos` |
| Restricciones de fecha (Shop) | `/admin/shop` | `shop_date_restrictions` | `shop` |
| Ventas en línea (Shop) | `/admin/ventas` | `shop_orders` (solo lectura) | `ventas` (solo *Ver*) |
| Promociones | `/admin/promociones` | `promotions` | `promociones` |
| Paquetes cumpleaños | `/admin/cumpleanos` | `birthday_packages` | `cumpleanos` |
| Galería cumpleaños | `/admin/cumpleanos/gallery` | `birthday_gallery` | `cumpleanos` |
| Popup del sitio | `/admin/popup` | `popup_config` | `popup` |
| Banner superior | `/admin/banner` | `banner_config` | `banner` |
| Usuarios admin | `/admin/usuarios` | Supabase Auth | — (solo super) |
| Leads/Registros | `/admin/leads` | `leads` | `leads` |

**APIs internas:**
- `GET /api/auth/callback` (retorno del login con Google)
- `GET /api/admin/shop-orders`
- `POST /api/admin/create-user` (alta de admin con rol y permisos, sin correo de invitación)
- `GET /api/admin/list-users`
- `PATCH /api/admin/update-user` (cambia rol y permisos)
- `POST /api/admin/delete-user`
- `GET /api/verify-email`

Las de usuarios son solo para super admins; las demás de `/api/admin` exigen el permiso de su sección.

---

## Tablas Supabase

`posts` · `menu_items` · `faqs` · `knowledge_base` · `attractions` · `promotions` · `birthday_packages` · `leads` · `branches` · `banner_config` · `shop_orders` · `shop_date_restrictions` · `shop_product_groups`

> La tabla `attractions` incluye `description` (opcional, se muestra en la vista pública), `knowledge_base`, `knowledge_category` y `knowledge_is_active` (texto/bandera solo informativo para el admin / consumo vía API; **no** se muestra en el sitio público).
>
> La tabla `promotions` incluye `description` (opcional, se muestra en la vista pública), `knowledge_base`, `knowledge_category` y `knowledge_is_active` (texto/bandera solo informativo para el admin / consumo vía API; **no** se muestra en el sitio público).
>
> La tabla `birthday_packages` incluye `description` (opcional, se muestra en la vista pública), `knowledge_base`, `knowledge_category` y `knowledge_is_active` (texto/bandera solo informativo para el admin / consumo vía API; **no** se muestra en el sitio público).
>
> La tabla `menu_items` incluye `available_in` (array de sucursales donde está disponible el producto; se muestra en la vista pública con filtro y badges), `knowledge_base`, `knowledge_category` y `knowledge_is_active` (texto/bandera solo informativo para el admin / consumo vía API; **no** se muestra en el sitio público). Nota: `knowledge_category` y `knowledge_is_active` son independientes de `category` y de cualquier estado público del producto.
>
> La tabla `knowledge_base` incluye `question`, `answer`, `knowledge_category` (categoría de la pregunta, editable y ampliable desde el admin), `branches` (array de sucursales a las que aplica; `['Todas las sucursales']` = todas) e `is_active` (bandera para activar/desactivar la respuesta sin borrarla; controla si se detecta en otras plataformas / consumo vía API).
>
> La tabla `faqs` incluye `question`, `answer` y `branches` (array de sucursales a las que aplica la pregunta frecuente; `['Todas las sucursales']` = todas).

> La tabla `banner_config` guarda **una sola fila** con la configuración del banner superior de la página de inicio: `is_active`, `image_url` + `image_width`/`image_height` (imagen para PC), `mobile_image_url` + `mobile_image_width`/`mobile_image_height` (imagen para móvil, se usa por debajo de 768 px), `desktop_max_height`, `image_alt`, `link_url` (opcional; ruta interna `/...` o URL externa `https://...`) e `is_dismissible` (muestra la ✕ para cerrarlo). Las dimensiones se detectan solas en el admin al elegir la imagen y sirven para reservar la altura antes de que cargue el JS.
>
> Comportamiento según qué imágenes haya: **ambas** → cada una en su breakpoint; **solo PC** → esa imagen a ancho completo siempre; **solo móvil** → a ancho completo en móvil, y en PC centrada con alto máximo `desktop_max_height` (default 200 px) sobre fondo negro, es decir con franjas negras a los costados.

Storage bucket: **`media`**

---

## Componentes globales

Presentes en prácticamente todas las páginas públicas:

| Componente | Archivo | Función |
|-----------|---------|---------|
| `<Header>` | `src/components/header.tsx` | Navegación principal |
| `<Footer>` | `src/components/footer.tsx` | Pie de página |
| `<WhatsappButton>` | `src/components/whatsapp-button.tsx` | Botón flotante de WhatsApp |
| `<SocialIcons>` | `src/components/social-icons.tsx` | Iconos de redes flotantes |
| `<VideoBackground>` | `src/components/video-background.tsx` | Video hero (prop `videoSrc`) |
| `<WavyDivider>` | `src/components/wavy-divider.tsx` | Divisor ondulado (prop `fromColor`) |
| `<PopupClient>` | `src/components/popup-client.tsx` | Popup configurable desde admin |
| `<TopBannerServer>` | `src/components/top-banner-server.tsx` | Banner superior configurable desde admin (solo `/`) |
| `<ShopButton>` | `src/components/shop-button.tsx` | Botón flotante "Compra tus entradas" (abajo a la izquierda) |

---

## Convenciones del proyecto

- Todas las páginas públicas incluyen `<Header>`, `<Footer>` y `<WhatsappButton>`.
- `<ShopButton>` es la excepción: va montado **una sola vez en `src/app/layout.tsx`**, no página por página, y se oculta solo (`usePathname`) en `/shop`, `/shop/success` y todo `/admin`. La lista está en la constante `RUTAS_OCULTAS` del propio componente.
- El menú de navegación (`navLinks` en `header.tsx`) es compartido por el menú de escritorio y el móvil: agregar un enlace ahí lo agrega en los dos.
- El video hero se controla con `<VideoBackground videoSrc="/assets/...">`.
- Los separadores entre secciones usan `<WavyDivider fromColor="bg-...">`.
- Cada página exporta `metadata` con `title`, `description`, `keywords` y `openGraph`.
- Schema.org JSON-LD se inyecta con `<script type="application/ld+json">` en páginas clave.
- Los íconos del admin usan **Lucide React**.
- Los botones de acción del admin usan `bg-orange-500 hover:bg-orange-600`.
- **Toda sección nueva del admin sigue el checklist de permisos** (ver *Permisos por sección* → *Checklist obligatorio*): registrarla en `SECCIONES_ADMIN`, ocultar los controles de edición con `<SoloEditores>`/`<BloqueEditable>`, proteger sus APIs con `requireAdmin` y agregar sus tablas a `supabase-admin-permissions.sql`.
- Los assets estáticos (imágenes, videos) viven en `public/assets/`.
- El **banner superior** se renderiza en `src/app/page.tsx` (antes de `<VideoBackground>` y `<Header>`) y publica su altura en la variable CSS `--banner-h` (definida en `globals.css` con valor `0px`). El header flotante se recorre con `top-[calc(1rem_+_var(--banner-h))]`, así que cualquier elemento nuevo fijado arriba debe usar ese mismo cálculo.

---

## Tienda / Pagos (Stripe)

La tienda online (`/shop`) vende accesos/productos con pago vía **Stripe Checkout**. Los **productos NO viven en Supabase**: viven en el catálogo de Stripe y se leen en vivo. Supabase solo guarda las restricciones de fecha por producto (`shop_date_restrictions`), las órdenes pagadas (`shop_orders`) y la agrupación visual de productos (`shop_product_groups`).

**Flujo `/shop`:** Sucursal → Productos → Fecha (calendario) → Pago (Stripe Checkout) → `/shop/success`.

**Archivos de la página `/shop`:** `src/app/shop/page.tsx` es un **Server Component** (metadata SEO, JSON-LD `WebPage` + `BreadcrumbList` + `FAQPage`, y el bloque de texto/FAQ indexable) que renderiza `shop-client.tsx` (todo el flujo interactivo) y le pasa ese bloque como `children`, que se muestra debajo del flujo **solo en el paso de sucursal** (en los demás pasos se oculta; como es el paso inicial, el HTML del servidor lo incluye y sigue siendo indexable). Las FAQ usan `<details>` nativo y no el `Accordion` de Radix, porque este no monta las respuestas cerradas y Google no las leería. `/shop/success` lleva `noindex` (`src/app/shop/success/layout.tsx`) y está en el `disallow` de `robots.ts`; `/shop` está en `sitemap.ts`.

**Métodos de pago (`create-checkout`): solo tarjeta, y Link deshabilitado a propósito.**
- `payment_method_types: ['card']` + `wallet_options: { link: { display: 'never' } }`. Se necesitan **los dos**: `payment_method_types` no oculta Link, porque además de método de pago Link es un *wallet* dentro del formulario de tarjeta y se sigue mostrando.
- Motivo: en un pago con Link el cargo queda como `payment_method_details.type = 'link'` y Stripe **no expone la tarjeta de fondo**, así que el webhook se queda sin `funding` ni `last4` para DECManager.
- **Apple Pay / Google Pay sí se pueden dejar encendidos** (probado): se liquidan como cargo de tarjeta normal y entregan `funding` y el `last4` de la tarjeta física — el número tokenizado del dispositivo va aparte, en `card.wallet.dynamic_last4`. No hay forma de apagarlos desde la API (`wallet_options` solo acepta `link`); eso solo se hace desde el Dashboard de Stripe.
- `locale: 'es-419'` (español latinoamericano) y **no** `'es'`: el de España formatea los importes como `1000,00 MXN`, con coma decimal.

**Variables de entorno:** `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `VENTA_WEBHOOK_URL` (destino del webhook de venta), `VENTA_WEBHOOK_API_KEY` (campo `API_Key` dentro del JSON de venta), `VENTA_WEBHOOK_TOKEN` (opcional, se envía como `Authorization: Bearer`). Correo (Google Workspace SMTP, ver `src/lib/mail.ts`): `SMTP_HOST` (`smtp.gmail.com`), `SMTP_PORT` (**465** = SSL, o 587 = STARTTLS), `SMTP_USER`, `SMTP_PASS` (App Password de Google), `SMTP_FROM`. Cuidado con el `SMTP_PORT`: un puerto mal escrito no da error de configuración, solo `ETIMEDOUT` al enviar (ya pasó en producción con `456`); `src/lib/mail.ts` avisa en el log si el puerto no es de los habituales y corta a los 10 s. apiVersion de Stripe: `2026-05-27.dahlia`.

**Archivos:** `src/lib/stripe.ts` · `src/lib/ticket.ts` (prefijo del contenido del QR) · `src/app/api/stripe/products` · `.../create-checkout` · `src/app/api/webhooks/stripe` (evento `checkout.session.completed` → `shop_orders`) · `src/app/api/shop/date-restrictions` · `src/app/admin/shop` (gestiona restricciones de fecha) · `src/app/admin/articulos/grupos` (gestiona los grupos de productos) · `src/app/admin/ventas` + `src/app/api/admin/shop-orders` (consulta de ventas).

### Consulta de ventas desde el admin (`/admin/ventas`)
Lista las órdenes pagadas (`shop_orders`) para no tener que entrar al Dashboard de Stripe: resumen (ingresos, ventas, piezas, clientes y ticket promedio), filtros por rango de fechas de compra (server-side), sucursal y búsqueda (correo, no. de ticket, sesión de Stripe o producto), detalle desplegable con los artículos de cada orden y descarga en CSV. Los datos los sirve `GET /api/admin/shop-orders` (params `from`, `to`, `limit`), protegida con `getAdminUser`: **usa la service role key** porque `shop_orders` solo la escribe el webhook y no hay política de lectura para el rol `authenticated`. Los importes se guardan en **centavos** (`amount_total`), por eso se dividen entre 100 al mostrarlos.

### Gestión de productos desde el admin (`/admin/articulos`)
Los productos de Stripe se pueden crear/editar/archivar desde el admin sin entrar al Dashboard de Stripe. La página llena la metadata automáticamente (`Id_Articulo`, `product_type`, `branch_id`) y las sucursales se eligen con casillas (se convierten a UUID). La imagen se toma de la biblioteca Multimedia (bucket `media`). Rutas API protegidas con sesión de Supabase (`src/lib/admin-auth.ts` → `getAdminUser`): `GET/POST /api/admin/stripe-products` y `PATCH /api/admin/stripe-products/[id]`. Los precios de Stripe son inmutables: al cambiar el precio se crea uno nuevo y se archiva el anterior.

**Webhook en Stripe:** `https://www.jumpin.com.mx/api/webhooks/stripe`, evento `checkout.session.completed`. **Con `www` obligatoriamente**: el dominio sin `www` responde 307 redirigiendo a `www`, y Stripe **no sigue redirecciones** en los webhooks (cuenta el 307 como entrega fallida, así que el pago se cobra pero no se guarda la orden, no se envía nada a DECManager y no sale el correo).

### Metadata de cada producto en Stripe
Al crear un producto en el Dashboard de Stripe se agregan estos campos de metadata:
- `branch_id`: UUID(s) de la sucursal (columna `id` de la tabla `branches`). Vacío = todas las sucursales; un solo UUID = esa sucursal; varios UUID separados por coma (`uuid1,uuid2`) = solo esas sucursales.
- `product_type`: `access` | `article` | `promotion` (default `access`).
- `Id_Articulo`: identificador del artículo. Se envía en el webhook de venta (ver abajo) por cada artículo comprado.
- `visible_en_shop`: `'true'` | `'false'`. Controla si el producto se le muestra a los clientes en `/shop` (switch **"Visible en la tienda"** en `/admin/articulos`, tanto en el diálogo de crear/editar como en la columna *Visible* de la tabla). **Sin la metadata = visible**, para que los productos anteriores a esta bandera sigan apareciendo. Es distinto de archivar: oculto sigue activo en Stripe y conserva su precio e historial; archivado desaparece del catálogo. El filtro lo aplica `src/app/api/stripe/products/route.ts`.

### Grupos de productos (`/admin/articulos/grupos`)
Varios productos de Stripe se pueden mostrar en `/shop` como **una sola tarjeta con selector** (p. ej. las tallas de unos calcetines). La agrupación es **solo visual y vive en Supabase**, en la tabla `shop_product_groups`: **la metadata de los productos en Stripe no se toca** — cada producto conserva su nombre, descripción, precio, imagen e `Id_Articulo` propios.

- Columnas: `name` (título de la tarjeta), `description` e `image_url` (ambas opcionales; si van vacías se usan las del producto seleccionado), `product_ids` (array de IDs de Stripe **en el orden en que se muestran las opciones**), `sort_order`, `is_active`, `display_mode`.
- `display_mode` (se elige en el diálogo del admin, "Vista de las opciones en /shop"): `'modal'` (default) = botón "Ver opciones" que abre una ventana con las opciones; `'expanded'` = opciones ya desplegadas dentro de la tarjeta, cada una con su botón Agregar. `/shop` lee los grupos con `select('*')` y trata la columna ausente como `'modal'`, así que no se rompe si la migración aún no se corre (pero el admin no podrá guardar grupos hasta correrla).
- SQL de creación: `supabase-shop-product-groups.sql` (lectura pública, escritura solo autenticados).
- El **carrito sigue siendo por producto individual**: cada opción entra a Stripe, al webhook de venta y al correo como su propia línea con su `Id_Articulo`.
- La etiqueta de cada botón se deriva del nombre del producto quitándole el nombre del grupo (`"Calcetines Jump-In - Chica"` + grupo `"Calcetines Jump-In"` → botón **"Chica"**); si no coincide el prefijo, se muestra el nombre completo.
- Si en la sucursal elegida solo está disponible un producto del grupo, la tarjeta se muestra como producto normal, sin selector.

### Webhook de venta en línea (saliente)
Al completarse un pago (`checkout.session.completed`), `src/app/api/webhooks/stripe/route.ts` genera un ticket y hace **POST** del JSON de venta a `VENTA_WEBHOOK_URL`. Es idempotente (columna `id_ticket` en `shop_orders` evita reenvíos en los reintentos de Stripe). Formato:

```json
{
  "API_Key": "llave de DECManager (env VENTA_WEBHOOK_API_KEY)",
  "Id_Ticket": "GUID (generado con crypto.randomUUID, sin el prefijo 07/ del QR)",
  "Id_Terminal": "branches.Id_Terminal de la sucursal elegida",
  "Total": 300,
  "Articulos": [{ "Id_Articulo": "meta del producto en Stripe", "Cantidad": 3, "Total": 100 }],
  "Fecha_Visita": "YYYY-MM-DD",
  "Forma_Pago": "credito | debito",
  "Detalle_Pago": "últimos 4 dígitos de la tarjeta"
}
```
- `API_Key` sale de `VENTA_WEBHOOK_API_KEY`; va **dentro del JSON**, no en los headers. Si no está configurada se envía `null`.
- `Id_Terminal` sale de la columna `branches.Id_Terminal` (Supabase) según `branch_id`.
- `Forma_Pago` mapea el `funding` de Stripe (`credit`→`credito`, `debit`/`prepaid`→`debito`). **DECManager solo acepta `credito` o `debito`**: cualquier otro valor (p. ej. `desconocido`) devuelve HTTP 400 y **se pierde la venta completa**. Por eso, cuando Stripe no reporta el `funding`, se envía la constante `FORMA_PAGO_DEFAULT` (`'credito'`) y se deja un warning en el log con el diagnóstico del PaymentIntent.
- `Detalle_Pago` = `last4` de la tarjeta. Puede ir `null` sin problema: **DECManager sí acepta el nulo** (probado); el campo que valida estrictamente es `Forma_Pago`.
- Los datos de la tarjeta los resuelve `resolverDatosTarjeta()` por varias vías (cargo expandido, cargo consultado por id, `PaymentMethod`), y nunca lanza: si falla, devuelve nulos y sigue. Ojo con los `expand`: `latest_charge` y `payment_method` sí son expandibles en el PaymentIntent, pero **`latest_charge.payment_method` no** ("This property cannot be expanded") y un expand inválido hace fallar toda la consulta.
- El JSON de ejemplo vive en `public/assets/docs/Json Venta En Linea Jump-In - v2.json`.

### Confirmación al cliente (QR + correo)
Al confirmarse el pago, el mismo webhook también:
- Genera un **QR** cuyo contenido es `07/` + el `Id_Ticket` (librería `qrcode`), p. ej. `07/22222222-2222-2222-2222-222222222222`. El prefijo vive en `src/lib/ticket.ts` (`QR_TICKET_PREFIX` / `buildQrContent`), que usan tanto el webhook como `/shop/success` para que ambos QR sean idénticos. **El prefijo es solo del QR**: el `Id_Ticket` que se guarda en `shop_orders` y el que se envía a DECManager siguen siendo el GUID puro, sin prefijo.
- Envía un **correo de confirmación** vía SMTP de Google Workspace (`src/lib/mail.ts`, Nodemailer). Si SMTP no está configurado, se omite sin romper el pago. El correo lleva, en este orden: **logo** de Jump-In, QR (inline + adjunto descargable), datos del ticket (no. de ticket, sucursal, fecha de visita, total), **tabla de productos comprados** (producto · cantidad · importe + total) y el bloque de **registro digital**.
- La página `/shop/success` hace *polling* a `/api/stripe/session` hasta que el webhook guarda el `id_ticket`, muestra el **QR en pantalla**, un **botón "Descargar QR"** y el bloque de **registro digital**.

**Imágenes del correo** (`src/app/api/webhooks/stripe/route.ts`): el logo se descarga de `LOGO_URL` (bucket `media` de Supabase) y se adjunta **inline con CID**, porque Outlook de escritorio bloquea imágenes remotas; si la descarga falla, cae a la URL remota sin romper el envío. Se usa **PNG y no WebP**: el motor de Word que usa Outlook de escritorio no renderiza WebP.

**Registro digital (responsiva anticipada):** botón "Registro digital" que lleva a `https://databiz.mx:300/Jump-in_Waiver/registroResponsable.aspx`, el portal externo (Databiz) donde el cliente llena su responsiva antes de llegar y evita filas; en sucursal se imprime para que la firme. La URL está **duplicada** en `src/app/api/webhooks/stripe/route.ts` (const `WAIVER_URL`) y en `src/app/shop/success/page.tsx` — si cambia, hay que actualizarla en ambos.

---

## Comandos útiles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
```
