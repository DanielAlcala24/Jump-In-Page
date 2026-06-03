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
| Atracciones | `/admin/atracciones` | `attractions` |
| Sucursales | `/admin/sucursales` | — |
| Promociones | `/admin/promociones` | `promotions` |
| Paquetes cumpleaños | `/admin/cumpleanos` | `birthday_packages` |
| Galería cumpleaños | `/admin/cumpleanos/gallery` | — |
| Popup del sitio | `/admin/popup` | — |
| Usuarios admin | `/admin/usuarios` | Supabase Auth |
| Leads/Registros | `/admin/leads` | `leads` |

**APIs internas:**
- `POST /api/admin/invite-user`
- `GET /api/admin/list-users`
- `DELETE /api/admin/delete-user`
- `GET /api/verify-email`

---

## Tablas Supabase

`posts` · `menu_items` · `faqs` · `attractions` · `promotions` · `birthday_packages` · `leads`

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

---

## Comandos útiles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
```
