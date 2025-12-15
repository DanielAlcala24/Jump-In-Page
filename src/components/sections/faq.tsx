'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// FAQs por defecto en caso de que no haya datos en la base de datos
const DEFAULT_FAQS = [
    {
        question: "¿Hay un límite de edad para saltar?",
        answer: "¡La diversión no tiene edad! Mientras los menores de 6 años juegan en su zona, tú puedes venir a saltar, reír y pasarla increíble en el resto del parque. ¡Te invitamos a unirte a la diversión!"
    },
    {
        question: "¿Es obligatorio usar calcetines especiales?",
        answer: "Sí, por razones de seguridad e higiene, todos los participantes deben usar calcetines antideslizantes especiales. Puedes comprarlos en recepción y son reutilizables."
    },
    {
        question: "¿Puedo llevar mi propia comida y bebida?",
        answer: "No se permite el ingreso de alimentos y bebidas del exterior. Contamos con una cafetería con una amplia variedad de snacks, bebidas y platillos para recargar energías."
    },
    {
        question: "¿Ofrecen paquetes para fiestas de cumpleaños?",
        answer: "¡Claro que sí! Nuestros paquetes de fiesta incluyen tiempo de salto, comida, un anfitrión exclusivo y un espacio privado para tu celebración. ¡Visita nuestra sección de eventos y reserva tu diversión!"
    },
    {
        question: "¿Cuentan con lockers para guardar mis pertenencias?",
        answer: "Sí, en nuestras sucursales encontrarás lockers disponibles para que guardes tus pertenencias de forma segura mientras disfrutas de los trampolines."
    },
    {
        question: "¿Qué tarjetas de crédito y débito aceptan?",
        answer: "En la mayoría de nuestras sucursales aceptamos tarjetas de crédito y débito Visa y Mastercard. American Express únicamente está disponible en nuestras sucursales de Interlomas y Cúspide."
    },
    {
        question: "¿Cuáles son sus horarios de apertura?",
        answer: "¡Ven a disfrutar! De lunes a viernes abrimos de 2:00 p.m. a 8:00 p.m., y los sábados y domingos de 11:00 a.m. a 8:00 p.m. Durante vacaciones nuestros horarios pueden variar, así que revisa nuestras redes sociales o la sección de tu sucursal favorita antes de visitarnos."
    },
    {
        question: "¿Puedo ingresar con mi mascota a las sucursales?",
        answer: "Por seguridad y comodidad de todos nuestros visitantes, no está permitido el ingreso de mascotas a nuestras instalaciones."
    },
    {
        question: "¿Hay alguna promoción especial para cumpleañeros?",
        answer: "¡Sí! Si cumples años, puedes visitarnos un día de la semana de tu cumpleaños presentando una copia impresa de tu CURP, INE o acta de nacimiento, y recibirás acceso ilimitado por ese día para que celebres a lo grande.⚠️ Importante: la promoción no incluye calcetines y solo puede usarse un día, no toda la semana."
    }
]

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
}

export default function Faq() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .order('order', { ascending: true })

        if (error) {
          console.error('Error fetching FAQs:', error)
          // Si hay error, usar FAQs por defecto
          setFaqs([])
        } else {
          setFaqs(data || [])
        }
      } catch (err) {
        console.error('Error:', err)
        setFaqs([])
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [supabase])

  // Usar FAQs de la base de datos si existen, sino usar los por defecto
  const displayFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS.map((faq, index) => ({
    id: `default-${index}`,
    question: faq.question,
    answer: faq.answer,
    order: index
  }))

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                    Resolviendo Dudas
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Preguntas Frecuentes
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Encuentra respuestas a las consultas más comunes de nuestros visitantes.
                </p>
            </div>
        </div>
        {loading ? (
          <div className="mt-12 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando preguntas...</p>
          </div>
        ) : (
          <div className="mt-12">
            <Accordion type="single" collapsible className="w-full">
                {displayFaqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`item-${index}`}>
                        <AccordionTrigger className="font-headline text-lg">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </div>
        )}
      </div>
    </section>
  );
}
