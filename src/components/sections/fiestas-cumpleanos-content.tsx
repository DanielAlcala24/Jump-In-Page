"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Gift, ShieldCheck, Sparkles } from "lucide-react"

const offerItems = [
    {
      title: 'Diversión Garantizada',
      description: 'Prometemos una experiencia llena de adrenalina y risas para el cumpleañero y sus invitados, creando momentos inolvidables.',
      icon: <Sparkles className="h-10 w-10 text-pink-500" />
    },
    {
      title: 'Variedad de Actividades',
      description: 'Con más de 1,000 m² de trampolines, cuerdas y muros, aseguramos que todos encuentren algo emocionante que hacer.',
      icon: <Gift className="h-10 w-10 text-green-500" />
    },
    {
      title: 'Seguridad Primordial',
      description: 'Contamos con instalaciones de la más alta calidad y un equipo de colaboradores capacitados para garantizar la seguridad en todo momento.',
      icon: <ShieldCheck className="h-10 w-10 text-sky-500" />
    }
  ];

const galleryImages = [
    { src: 'https://picsum.photos/600/800?random=41', alt: 'Niños saltando en fiesta', hint: 'kids jumping party' },
    { src: 'https://picsum.photos/600/800?random=42', alt: 'Pastel de cumpleaños en Jump-In', hint: 'birthday cake' },
    { src: 'https://picsum.photos/600/800?random=43', alt: 'Grupo de amigos celebrando', hint: 'friends celebrating' },
    { src: 'https://picsum.photos/600/800?random=44', alt: 'Decoración de fiesta', hint: 'party decoration' },
]

const formSchema = z.object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().email({ message: "Por favor, introduce un email válido." }),
    phone: z.string().min(10, { message: "El teléfono debe tener al menos 10 dígitos." }),
    branch: z.string().min(1, { message: "Por favor, selecciona una sucursal." }),
    guests: z.coerce.number().min(1, { message: "Debe haber al menos 1 invitado." }),
    message: z.string().optional(),
})

export default function FiestasCumpleanosContent() {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            branch: "",
            guests: 10,
            message: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        toast({
          title: "¡Solicitud Enviada!",
          description: "Gracias por tu interés. Nos pondremos en contacto contigo pronto.",
        })
        form.reset();
    }

    return (
        <section id="birthday-content" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-5xl px-4 md:px-6 space-y-16">
                
                {/* Offer Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Tu Fiesta de Cumpleaños Soñada</h2>
                    <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-lg">
                    Jump-In es el lugar donde la diversión extrema y la celebración se encuentran. Ofrecemos una experiencia única para personas de todas las edades, garantizando momentos inolvidables de felicidad.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {offerItems.map((item) => (
                        <Card key={item.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="items-center">
                                <div className="p-4 bg-primary/10 rounded-full">{item.icon}</div>
                                <CardTitle className="font-headline">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Gallery Section */}
                <div>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Galería de Fiestas</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-lg">
                        Inspírate con momentos de celebraciones pasadas y visualiza la increíble fiesta que puedes tener.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map((image, index) => (
                            <div key={index} className="overflow-hidden rounded-lg group shadow-lg transition-all hover:shadow-2xl">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={600}
                                    height={800}
                                    data-ai-hint={image.hint}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking Form Section */}
                <Card className="shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="text-center p-8 bg-primary text-primary-foreground">
                        <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Reserva tu Fiesta</CardTitle>
                        <CardDescription className="text-primary-foreground/80 md:text-lg">
                            Completa el formulario para recibir una cotización. ¡Es fácil y rápido!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre Completo</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Tu nombre" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="tu@email.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono</FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="55 1234 5678" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="branch"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sucursal</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Elige una sucursal" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="interlomas">Interlomas</SelectItem>
                                                        <SelectItem value="cuspide">La Cúspide</SelectItem>
                                                        <SelectItem value="miramontes">Miramontes</SelectItem>
                                                        <SelectItem value="churubusco">Churubusco</SelectItem>
                                                        <SelectItem value="cuernavaca">Cuernavaca</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guests"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Número de Invitados</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mensaje Adicional</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Cuéntanos más sobre tu evento..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="text-center">
                                    <Button type="submit" size="lg" className="bg-pink-500 hover:bg-pink-600 text-white w-full md:w-auto">
                                        Solicitar Cotización
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
