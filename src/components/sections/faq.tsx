import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "¿Hay un límite de edad para saltar?",
        answer: "¡La diversión no tiene edad! Tenemos áreas designadas para los más pequeños (menores de 6 años) para garantizar su seguridad, y el resto de las instalaciones son para todas las edades."
    },
    {
        question: "¿Es obligatorio usar calcetines especiales?",
        answer: "Sí, por razones de seguridad e higiene, todos los participantes deben usar nuestros calcetines antideslizantes especiales. Puedes comprarlos en recepción y son reutilizables."
    },
    {
        question: "¿Puedo llevar mi propia comida y bebida?",
        answer: "No se permite el ingreso de alimentos y bebidas del exterior. Contamos con una cafetería con una amplia variedad de snacks, bebidas y platillos para recargar energías."
    },
    {
        question: "¿Ofrecen paquetes para fiestas de cumpleaños?",
        answer: "¡Claro que sí! Tenemos varios paquetes de fiesta que incluyen tiempo de salto, comida, un anfitrión dedicado y un área de celebración privada. Visita nuestra sección de eventos para más detalles."
    }
]

export default function Faq() {
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
        <div className="mt-12">
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="font-headline text-lg">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    </section>
  );
}
