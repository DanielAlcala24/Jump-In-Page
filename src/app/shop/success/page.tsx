'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense, useCallback } from 'react'
import QRCode from 'qrcode'
import { buildQrContent } from '@/lib/ticket'
import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsappButton from '@/components/whatsapp-button'
import { CheckCircle2, Loader2, Download, ClipboardCheck, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [idTicket, setIdTicket] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  // Consulta la sesión; reintenta hasta que el webhook genere el Id_Ticket (unos segundos).
  useEffect(() => {
    if (!sessionId) { setLoading(false); return }

    let cancelled = false
    let attempts = 0
    const maxAttempts = 12 // ~24s

    const poll = async () => {
      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`)
        const data = await res.json()
        if (cancelled) return
        setSession(data)
        if (data.id_ticket) {
          setIdTicket(data.id_ticket)
          setLoading(false)
          return
        }
      } catch {
        /* reintenta */
      }
      attempts++
      if (attempts >= maxAttempts) {
        // Se muestra la confirmación aunque el ticket aún no llegue (llegará por correo).
        setLoading(false)
        return
      }
      if (!cancelled) setTimeout(poll, 2000)
    }

    poll()
    return () => { cancelled = true }
  }, [sessionId])

  // Genera el QR cuando ya hay Id_Ticket. El contenido lleva el prefijo: "07/<guid>".
  useEffect(() => {
    if (!idTicket) return
    QRCode.toDataURL(buildQrContent(idTicket), { width: 320, margin: 2 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [idTicket])

  const handleDownload = useCallback(() => {
    if (!qrDataUrl || !idTicket) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `ticket-${idTicket}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [qrDataUrl, idTicket])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="text-gray-500 mt-4">Confirmando tu pago…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
      <div className="bg-green-100 rounded-full p-6 mb-6">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold font-headline text-gray-900 mb-3">
        ¡Pago exitoso!
      </h1>
      <p className="text-gray-600 text-lg max-w-md mb-2">
        Tu compra fue procesada correctamente. También te enviamos tu código QR por correo.
      </p>
      {session?.customer_email && (
        <p className="text-gray-500 text-sm mb-6">Confirmación enviada a <strong>{session.customer_email}</strong></p>
      )}

      {qrDataUrl ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-3">Presenta este código QR en tu sucursal</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="Código QR de tu ticket" width={240} height={240} className="rounded-lg" />
          <p className="text-xs text-gray-400 mt-3 break-all max-w-[240px]">No. de ticket: {idTicket}</p>
          <Button onClick={handleDownload} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
            <Download className="h-4 w-4 mr-2" /> Descargar QR
          </Button>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-6">
          Tu código QR se está generando y llegará a tu correo en unos momentos.
        </p>
      )}

      {/* Registro anticipado de la responsiva (sistema externo Databiz) */}
      <div className="w-full max-w-md bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6 flex flex-col items-center">
        <div className="bg-orange-100 rounded-full p-3 mb-3">
          <ClipboardCheck className="h-7 w-7 text-orange-500" />
        </div>
        <h2 className="text-lg md:text-xl font-bold font-headline text-gray-900 mb-1">
          Agiliza tu acceso registrando tu visita
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Llena tu responsiva en línea y evita filas al llegar a la sucursal.
        </p>
        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
          <a
            href="https://databiz.mx:300/Jump-in_Waiver/registroResponsable.aspx"
            target="_blank"
            rel="noopener noreferrer"
          >
            Registro digital <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
          <Link href="/">Ir al inicio</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Hacer otra compra</Link>
        </Button>
      </div>
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
