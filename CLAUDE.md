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

---

## Panel de administración (`/admin/...`)

Requiere autenticación Supabase. Login en `/admin/login`.

| Sección | Ruta | Tabla Supabase |
|---------|------|----------------|
| Dashboard | `/admin` | — |
| Artículos (Blog) | `/admin/posts` | `posts` |
| Multimedia | `/admin/media` | Storage bucket `media` |
| Menú de alimentos | `/admin/menu` | `menu_items` |
| Preguntas frecuentes | `/admin/faq` | `faqs` |
| Base de conocimiento | `/admin/base-conocimiento` | `knowledge_base` |
| Atracciones | `/admin/atracciones` | `attractions` |
| Sucursales | `/admin/sucursales` | — |
| Artículos (Shop/Stripe) | `/admin/articulos` | Productos de Stripe (API) |
| Grupos de productos (Shop) | `/admin/articulos/grupos` | `shop_product_groups` |
| Promociones | `/admin/promociones` | `promotions` |
| Paquetes cumpleaños | `/admin/cumpleanos` | `birthday_packages` |
| Galería cumpleaños | `/admin/cumpleanos/gallery` | — |
| Popup del sitio | `/admin/popup` | — |
| Banner superior | `/admin/banner` | `banner_config` |
| Usuarios admin | `/admin/usuarios` | Supabase Auth |
| Leads/Registros | `/admin/leads` | `leads` |

**APIs internas:**
- `POST /api/admin/invite-user`
- `GET /api/admin/list-users`
- `DELETE /api/admin/delete-user`
- `GET /api/verify-email`

---

## Tablas Supabase

`posts` · `menu_items` · `faqs` · `knowledge_base` · `attractions` · `promotions` · `birthday_packages` · `leads`

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

---

## Convenciones del proyecto

- Todas las páginas públicas incluyen `<Header>`, `<Footer>` y `<WhatsappButton>`.
- El video hero se controla con `<VideoBackground videoSrc="/assets/...">`.
- Los separadores entre secciones usan `<WavyDivider fromColor="bg-...">`.
- Cada página exporta `metadata` con `title`, `description`, `keywords` y `openGraph`.
- Schema.org JSON-LD se inyecta con `<script type="application/ld+json">` en páginas clave.
- Los íconos del admin usan **Lucide React**.
- Los botones de acción del admin usan `bg-orange-500 hover:bg-orange-600`.
- Los assets estáticos (imágenes, videos) viven en `public/assets/`.
- El **banner superior** se renderiza en `src/app/page.tsx` (antes de `<VideoBackground>` y `<Header>`) y publica su altura en la variable CSS `--banner-h` (definida en `globals.css` con valor `0px`). El header flotante se recorre con `top-[calc(1rem_+_var(--banner-h))]`, así que cualquier elemento nuevo fijado arriba debe usar ese mismo cálculo.

---

## Tienda / Pagos (Stripe)

La tienda online (`/shop`) vende accesos/productos con pago vía **Stripe Checkout**. Los **productos NO viven en Supabase**: viven en el catálogo de Stripe y se leen en vivo. Supabase solo guarda las restricciones de fecha por producto (`shop_date_restrictions`), las órdenes pagadas (`shop_orders`) y la agrupación visual de productos (`shop_product_groups`).

**Flujo `/shop`:** Sucursal → Productos → Fecha (calendario) → Pago (Stripe Checkout) → `/shop/success`.

**Variables de entorno:** `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `VENTA_WEBHOOK_URL` (destino del webhook de venta), `VENTA_WEBHOOK_API_KEY` (campo `API_Key` dentro del JSON de venta), `VENTA_WEBHOOK_TOKEN` (opcional, se envía como `Authorization: Bearer`). Correo (Google Workspace SMTP, ver `src/lib/mail.ts`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (App Password de Google), `SMTP_FROM`. apiVersion de Stripe: `2026-05-27.dahlia`.

**Archivos:** `src/lib/stripe.ts` · `src/lib/ticket.ts` (prefijo del contenido del QR) · `src/app/api/stripe/products` · `.../create-checkout` · `src/app/api/webhooks/stripe` (evento `checkout.session.completed` → `shop_orders`) · `src/app/api/shop/date-restrictions` · `src/app/admin/shop` (gestiona restricciones de fecha) · `src/app/admin/articulos/grupos` (gestiona los grupos de productos).

### Gestión de productos desde el admin (`/admin/articulos`)
Los productos de Stripe se pueden crear/editar/archivar desde el admin sin entrar al Dashboard de Stripe. La página llena la metadata automáticamente (`Id_Articulo`, `product_type`, `branch_id`) y las sucursales se eligen con casillas (se convierten a UUID). La imagen se toma de la biblioteca Multimedia (bucket `media`). Rutas API protegidas con sesión de Supabase (`src/lib/admin-auth.ts` → `getAdminUser`): `GET/POST /api/admin/stripe-products` y `PATCH /api/admin/stripe-products/[id]`. Los precios de Stripe son inmutables: al cambiar el precio se crea uno nuevo y se archiva el anterior.

**Webhook en Stripe:** `https://www.jumpin.com.mx/api/webhooks/stripe`, evento `checkout.session.completed`. **Con `www` obligatoriamente**: el dominio sin `www` responde 307 redirigiendo a `www`, y Stripe **no sigue redirecciones** en los webhooks (cuenta el 307 como entrega fallida, así que el pago se cobra pero no se guarda la orden, no se envía nada a DECManager y no sale el correo).

### Metadata de cada producto en Stripe
Al crear un producto en el Dashboard de Stripe se agregan estos campos de metadata:
- `branch_id`: UUID(s) de la sucursal (columna `id` de la tabla `branches`). Vacío = todas las sucursales; un solo UUID = esa sucursal; varios UUID separados por coma (`uuid1,uuid2`) = solo esas sucursales.
- `product_type`: `access` | `article` | `promotion` (default `access`).
- `Id_Articulo`: identificador del artículo. Se envía en el webhook de venta (ver abajo) por cada artículo comprado.

### Grupos de productos (`/admin/articulos/grupos`)
Varios productos de Stripe se pueden mostrar en `/shop` como **una sola tarjeta con selector** (p. ej. las tallas de unos calcetines). La agrupación es **solo visual y vive en Supabase**, en la tabla `shop_product_groups`: **la metadata de los productos en Stripe no se toca** — cada producto conserva su nombre, descripción, precio, imagen e `Id_Articulo` propios.

- Columnas: `name` (título de la tarjeta), `description` e `image_url` (ambas opcionales; si van vacías se usan las del producto seleccionado), `product_ids` (array de IDs de Stripe **en el orden en que se muestran las opciones**), `sort_order`, `is_active`.
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
- `Forma_Pago` mapea el `funding` de Stripe (`credit`→`credito`, `debit`→`debito`).
- `Detalle_Pago` = `last4` de la tarjeta (leído del `latest_charge` del PaymentIntent).
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
