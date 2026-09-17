import { Metadata } from 'next'
import Link from 'next/link'
import { Ticket, Package, CalendarCheck, QrCode, ShieldCheck, ChevronDown } from 'lucide-react'
import ShopClient from './shop-client'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jumpin.com.mx'
const SHOP_URL = `${SITE_URL}/shop`

export const metadata: Metadata = {
  title: 'Compra tus Entradas en Línea',
  description:
    'Compra en línea tus entradas a Jump-In, el parque de trampolines en México. Elige tu sucursal y fecha, agrega tus calcetines antiderrapantes y paga seguro con tarjeta. Recibe tu QR al instante.',
  keywords: [
    'comprar entradas jump-in',
    'boletos jump-in',
    'entradas trampoline park',
    'boletos parque de trampolines',
    'comprar boletos en línea trampolines',
    'calcetines antiderrapantes jump-in',
    'calcetas antiderrapantes trampolines',
    'tienda jump-in',
    'jump-in precios',
  ],
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Compra tus Entradas a Jump-In en Línea',
    description:
      'Accesos y calcetines antiderrapantes Jump-In. Compra desde casa, paga seguro y llega directo a saltar con tu QR.',
    url: '/shop',
    siteName: 'Jump-In',
    locale: 'es_MX',
    type: 'website',
    images: [{ url: '/assets/g1.jpg', alt: 'Parque de trampolines Jump-In' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compra tus Entradas a Jump-In en Línea',
    description: 'Accesos y calcetines Jump-In. Paga seguro y recibe tu QR al instante.',
    images: ['/assets/g1.jpg'],
  },
}

// Preguntas visibles en la página; las mismas alimentan el schema FAQPage.
const FAQS = [
  {
    question: '¿Puedo comprar mis entradas a Jump-In en línea?',
    answer:
      'Sí. En esta tienda eliges tu sucursal, agregas tus accesos y productos al carrito, seleccionas la fecha de tu visita y pagas con tarjeta de crédito o débito de forma segura.',
  },
  {
    question: '¿Puedo comprar los calcetines antiderrapantes desde la página?',
    answer:
      'Sí. El uso de calcetines antiderrapantes es obligatorio para saltar, y puedes agregarlos a tu compra en línea eligiendo la talla que necesitas. Son reutilizables, así que te sirven para tus siguientes visitas.',
  },
  {
    question: '¿Cómo recibo mi compra?',
    answer:
      'Al confirmarse el pago verás un código QR en pantalla, que también puedes descargar, y te llegará un correo de confirmación con tu QR y el detalle de tu compra. Solo preséntalo en la sucursal el día de tu visita.',
  },
  {
    question: '¿Qué formas de pago aceptan en la tienda en línea?',
    answer:
      'Aceptamos tarjetas de crédito y débito. El pago se procesa de forma segura a través de Stripe; Jump-In no almacena los datos de tu tarjeta.',
  },
  {
    question: '¿Necesito llenar la responsiva antes de ir?',
    answer:
      'Te recomendamos hacer tu registro digital antes de llegar para evitar filas. Encontrarás el enlace en tu confirmación de compra y en el correo que te enviamos.',
  },
]

const BENEFITS = [
  { icon: Ticket, title: 'Accesos', text: 'Compra tu tiempo de salto para la sucursal y el día que prefieras.' },
  { icon: Package, title: 'Calcetines Jump-In', text: 'Agrega tus calcetines antiderrapantes, obligatorios para saltar, en tu talla.' },
]

const STEPS = [
  { icon: CalendarCheck, title: 'Elige sucursal y fecha', text: 'Selecciona dónde y cuándo vas a saltar.' },
  { icon: ShieldCheck, title: 'Paga seguro', text: 'Pago con tarjeta de crédito o débito procesado por Stripe.' },
  { icon: QrCode, title: 'Recibe tu QR', text: 'Te llega por correo y lo presentas al llegar.' },
]

export default function ShopPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SHOP_URL}#webpage`,
        url: SHOP_URL,
        name: 'Compra tus Entradas en Línea | Jump-In',
        description: metadata.description,
        inLanguage: 'es-MX',
        isPartOf: { '@type': 'WebSite', name: 'Jump-In', url: SITE_URL },
        potentialAction: {
          '@type': 'BuyAction',
          target: SHOP_URL,
          seller: { '@type': 'Organization', name: 'Jump-In', url: SITE_URL },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Tienda en línea', item: SHOP_URL },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ShopClient>
        {/* Contenido renderizado en el servidor para que Google lo indexe:
            el flujo de compra de arriba se carga en el cliente. */}
        <section className="bg-white border-t py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-center mb-3">
              Compra tus entradas y calcetines Jump-In en línea
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
              Evita filas y asegura tu diversión en el parque de trampolines más divertido de México.
              Desde nuestra tienda en línea puedes comprar tus accesos y calcetines
              antiderrapantes para cualquiera de nuestras{' '}
              <Link href="/sucursales" className="text-orange-500 font-semibold hover:underline">sucursales</Link>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl bg-orange-50 p-5 text-center">
                  <Icon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-bold font-headline text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{text}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl md:text-2xl font-bold font-headline text-center mb-6">¿Cómo comprar tus boletos?</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="rounded-xl border p-5 text-center">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold mb-2">
                    {i + 1}
                  </span>
                  <h3 className="font-bold font-headline text-gray-900 flex items-center justify-center gap-1.5 mb-1">
                    <Icon className="h-4 w-4 text-orange-500" /> {title}
                  </h3>
                  <p className="text-sm text-gray-600">{text}</p>
                </li>
              ))}
            </ol>

            <h2 className="text-xl md:text-2xl font-bold font-headline text-center mb-4">Preguntas frecuentes</h2>
            {/* <details> nativo: las respuestas quedan en el HTML aunque estén cerradas
                (el Accordion de Radix no las monta hasta abrirlas y Google no las leería). */}
            <div className="divide-y border-y">
              {FAQS.map((f) => (
                <details key={f.question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-gray-600">{f.answer}</p>
                </details>
              ))}
            </div>

            <p className="text-sm text-gray-500 text-center mt-8">
              Consulta también nuestros{' '}
              <Link href="/precios-y-promociones" className="text-orange-500 hover:underline">precios y promociones</Link>,
              las{' '}
              <Link href="/atracciones" className="text-orange-500 hover:underline">atracciones</Link> y los{' '}
              <Link href="/terminos-y-condiciones" className="text-orange-500 hover:underline">términos y condiciones</Link>.
            </p>
          </div>
        </section>
      </ShopClient>
    </>
  )
}
