# Jump-In — Project Context for AI Agents

## Business

Jump-In is a **trampoline park** chain in Mexico. The public website is at **https://jumpin.com.mx**. It has multiple locations (sucursales), two mascots named **Bongo** and **Maya**, and the primary brand color is **orange (orange-500)**. Social media: Facebook `JumpInMexico`, Instagram `jumpinmexico`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ with App Router (TypeScript) |
| Styling | Tailwind CSS + shadcn/ui (`src/components/ui/`) |
| Database / Auth / Storage | Supabase |
| Fonts | Poppins (`font-headline`) · PT Sans (`font-body`) |
| Generative AI (internal) | Genkit (`src/ai/`) |

**Required environment variables (create `.env.local`):**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://jumpin.com.mx
```

**Supabase clients:**
- Server Components → `createServerComponentClient()` in `src/lib/supabase-server.ts`
- Client Components → `createClientComponentClient()` in `src/lib/supabase.ts`

---

## Analytics / Marketing (loaded in `src/app/layout.tsx`)

| Tool | ID |
|------|----|
| Google Tag Manager | GTM-PFWMMNBZ |
| Google Analytics 4 | G-7VFM1S3HZN |
| Google Ads | AW-16651738395 |
| Microsoft Clarity | lxqed18ama |
| HubSpot (chat/CRM) | account 48545315 |

---

## Public Pages

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/atracciones` | Attractions listing |
| `/fiestas-y-eventos/fiestas-cumpleanos` | Birthday parties with packages |
| `/fiestas-y-eventos/eventos-empresariales` | Corporate events |
| `/menu-alimentos` | Food menu |
| `/precios-y-promociones` | Prices and promotions |
| `/galeria` | Photo gallery |
| `/sucursales` | Locations list |
| `/sucursales/[slug]` | Individual location detail |
| `/nosotros` | About us |
| `/compromiso-social` | Social commitment |
| `/blog` | Blog |
| `/blog/[slug]` | Individual blog post |
| `/facturacion` | Billing / invoicing |
| `/aviso-de-privacidad` | Privacy policy |
| `/terminos-y-condiciones` | Terms and conditions |
| `/casafutbol` | Jump-In × Casa Fútbol collaboration |

---

## Admin Panel (`/admin/...`)

Requires Supabase authentication. Login at `/admin/login`.

| Section | Route | Supabase Table |
|---------|-------|----------------|
| Dashboard | `/admin` | — |
| Blog Posts | `/admin/posts` | `posts` |
| Media | `/admin/media` | Storage bucket `media` |
| Food Menu | `/admin/menu` | `menu_items` |
| FAQ | `/admin/faq` | `faqs` |
| Attractions | `/admin/atracciones` | `attractions` |
| Locations | `/admin/sucursales` | — |
| Promotions | `/admin/promociones` | `promotions` |
| Birthday Packages | `/admin/cumpleanos` | `birthday_packages` |
| Birthday Gallery | `/admin/cumpleanos/gallery` | — |
| Site Popup | `/admin/popup` | — |
| Admin Users | `/admin/usuarios` | Supabase Auth |
| Leads | `/admin/leads` | `leads` |

**Internal API routes:**
- `POST /api/admin/invite-user`
- `GET /api/admin/list-users`
- `DELETE /api/admin/delete-user`
- `GET /api/verify-email`

---

## Supabase Tables

`posts` · `menu_items` · `faqs` · `attractions` · `promotions` · `birthday_packages` · `leads`

Storage bucket: **`media`**

---

## Global Components

Present in virtually all public pages:

| Component | File | Purpose |
|-----------|------|---------|
| `<Header>` | `src/components/header.tsx` | Main navigation |
| `<Footer>` | `src/components/footer.tsx` | Page footer |
| `<WhatsappButton>` | `src/components/whatsapp-button.tsx` | Floating WhatsApp button |
| `<SocialIcons>` | `src/components/social-icons.tsx` | Floating social media icons |
| `<VideoBackground>` | `src/components/video-background.tsx` | Hero video background (prop `videoSrc`) |
| `<WavyDivider>` | `src/components/wavy-divider.tsx` | Wavy section divider (prop `fromColor`) |
| `<PopupClient>` | `src/components/popup-client.tsx` | Admin-configurable site popup |

---

## Project Conventions

- All public pages include `<Header>`, `<Footer>`, and `<WhatsappButton>`.
- Hero video is controlled via `<VideoBackground videoSrc="/assets/...">`.
- Section separators use `<WavyDivider fromColor="bg-...">`.
- Every page exports a `metadata` object with `title`, `description`, `keywords`, and `openGraph`.
- Schema.org JSON-LD is injected via `<script type="application/ld+json">` on key pages.
- Admin icons use **Lucide React**.
- Admin action buttons use `bg-orange-500 hover:bg-orange-600`.
- Static assets (images, videos) live in `public/assets/`.
- The project is written in Spanish (UI text, variable names in some components, routes).

---

## Dev Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
```
