'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsappButton from '@/components/whatsapp-button'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }
    fetch(`/api/stripe/session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => { setSession(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [sessionId])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
      {loading ? (
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      ) : (
        <>
          <div className="bg-green-100 rounded-full p-6 mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline text-gray-900 mb-3">
            ¡Pago exitoso!
          </h1>
          <p className="text-gray-600 text-lg max-w-md mb-2">
            Tu compra fue procesada correctamente. Recibirás un correo de confirmación con los detalles de tu visita.
          </p>
          {session?.customer_email && (
            <p className="text-gray-500 text-sm mb-6">Confirmación enviada a <strong>{session.customer_email}</strong></p>
          )}
          <div className="flex gap-3 flex-wrap justify-center">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/">Ir al inicio</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/shop">Hacer otra compra</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default function ShopSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  )
}
