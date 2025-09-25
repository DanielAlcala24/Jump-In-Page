
import Header from '@/components/header';
import Footer from '@/components/footer';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import VideoBackground from '@/components/video-background';
import Link from 'next/link';
import { ChevronDown, MapPin, Clock, Phone, Ticket, Calendar, Utensils, PartyPopper, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const sucursal = {
  name: "Churubusco",
  address: "Canal de Miramontes 2053, Coapa, Girasoles III, Coyoacán, 04920 Ciudad de México, CDMX",
  mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.044530095874!2d-99.13679888509501!3d19.32415128694665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fe8d8c6b75f7%3A0x2616a24f5c9a7c5c!2sJump-in%20Miramontes!5e0!3m2!1ses!2smx!4v1624387840123!5m2!1ses!2smx",
  whatsapp: "525512345678",
  phone: "55 1234 5678",
  prices: [
    { title: "Salto Individual", price: "$200/hr", description: "Acceso a todas las áreas de trampolines.", image: "/assets/g1.jpg" },
    { title: "Paquete Amigos", price: "$700/hr (4 personas)", description: "Diversión en grupo con un precio especial.", image: "/assets/g2.jpg" },
    { title: "Pase Anual", price: "$2500", description: "Salta todo el año sin límites.", image: "/assets/g3.jpeg" }
  ],
  horarios: "Lunes a Viernes: 2 PM - 8 PM | Sábados y Domingos: 11 AM - 8 PM",
  attractions: [
    { name: "Climbing Wall", image: "/assets/atracciones/exclusivas/climbingwall.jpg" },
    { name: "Juegos de Destreza", image: "/assets/atracciones/exclusivas/destreza.jpg" },
    { name: 'Main Court', image: '/assets/atracciones/trampolines/mainCourt.jpg'},
    { name: 'Jump Jam', image: '/assets/atracciones/trampolines/JumpJam.jpg'},
    { name: 'Dodge Ball', image: '/assets/atracciones/trampolines/dodgeBall.jpg'},
    { name: 'Foam Pit', image: '/assets/atracciones/trampolines/foamPit.jpg'},
    { name: 'Laberinto de Obstáculos', image: '/assets/atracciones/menores/laberinto.jpg' },
    { name: 'Kid Zone', image: '/assets/atracciones/menores/kidsZone.jpg' },
    { name: 'Rope Course Kids', image: '/assets/atracciones/menores/ropesKids.jpg' },
    { name: 'Ropes Course', image: '/assets/atracciones/extremas/ropes.jpg'},
  ],
  gallery: [
    { src: '/assets/g1.jpg', alt: 'Interior Churubusco' },
    { src: '/assets/g2.jpg', alt: 'Gente saltando' },
    { src: '/assets/g3.jpeg', alt: 'Fiesta de cumpleaños' },
    { src: '/assets/g4.jpeg', alt: 'Exterior de la sucursal' }
  ]
};


export default function SucursalChurubuscoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      <Header />
      <SocialIcons />
      <main className="flex-1">
        <section className="relative flex h-[50vh] w-full flex-col items-center justify-center text-center text-white">
          <div className="relative z-10 mx-4 flex flex-col items-center">
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl font-headline">
              Jump-In {sucursal.name}
            </h1>
          </div>
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            <Link href="#info-sucursal" aria-label="Scroll down">
              <ChevronDown className="h-10 w-10 animate-bounce text-background/80" />
            </Link>
          </div>
        </section>

        <section id="info-sucursal" className="py-16 px-4 md:px-6 bg-transparent">
          <div className="container mx-auto max-w-6xl space-y-16">

            {/* Dirección y Mapa */}
            <Card className="shadow-lg rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl"><MapPin className="text-primary"/> Dirección</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <p className="text-lg text-muted-foreground mb-4">{sucursal.address}</p>
                    <Button asChild>
                        <Link href={`https://www.google.com/maps?q=${encodeURIComponent(sucursal.address)}`} target="_blank">
                            Llévame ahí
                        </Link>
                    </Button>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe src={sucursal.mapLink} width="100%" height="100%" style={{ border:0 }} allowFullScreen loading="lazy"></iframe>
                </div>
              </CardContent>
            </Card>

            {/* Precios y Horarios */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl"><Ticket className="text-primary"/> Precios</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {sucursal.prices.map((price, index) => (
                           <div key={index} className="flex items-center gap-4">
                                <Image src={price.image} alt={price.title} width={150} height={100} className="rounded-md object-cover"/>
                                <div>
                                    <h4 className="font-bold">{price.title} - <span className="text-primary">{price.price}</span></h4>
                                    <p className="text-sm text-muted-foreground">{price.description}</p>
                                </div>
                           </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl"><Clock className="text-primary"/> Horarios de Operación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-muted-foreground">{sucursal.horarios}</p>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl mt-8"><Phone className="text-primary"/> Contacto</CardTitle>
                        <p className="text-lg text-muted-foreground mt-4">Teléfono: {sucursal.phone}</p>
                        <Button asChild className="mt-2 bg-green-500 hover:bg-green-600">
                            <Link href={`https://wa.me/${sucursal.whatsapp}`} target="_blank">
                                WhatsApp: {sucursal.phone}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
            
            {/* Atracciones */}
            <Card className="shadow-lg rounded-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Atracciones en {sucursal.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sucursal.attractions.map((attr, index) => (
                        <div key={index} className="relative group overflow-hidden rounded-lg aspect-[4/3]">
                           <Image src={attr.image} alt={attr.name} fill className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"/>
                           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                               <h4 className="text-white text-xl font-bold font-headline text-center">{attr.name}</h4>
                           </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Fiestas y Eventos */}
            <Card className="shadow-lg rounded-2xl bg-primary text-primary-foreground text-center p-8">
                <PartyPopper className="h-12 w-12 mx-auto mb-4"/>
                <h3 className="font-headline text-3xl font-bold">Fiestas y Eventos en {sucursal.name}</h3>
                <p className="max-w-2xl mx-auto my-4">Celebra tu cumpleaños o evento de empresa con nosotros para una experiencia inolvidable llena de diversión y adrenalina.</p>
                <Button variant="secondary" size="lg" asChild>
                    <Link href={`/fiestas-y-eventos`}>
                        Cotizar mi Evento en {sucursal.name} <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
            </Card>

            {/* Registro Digital y Menú */}
             <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <Users className="h-10 w-10 text-primary mb-2"/>
                    <h3 className="font-headline text-2xl font-bold">Agiliza tu Entrada</h3>
                    <p className="text-muted-foreground mb-4">Regístrate antes de tu visita a {sucursal.name} aquí.</p>
                    <Button asChild>
                        <Link href="http://decmanager.com:140" target="_blank">Registro Digital</Link>
                    </Button>
                </Card>
                 <Card className="shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <Utensils className="h-10 w-10 text-primary mb-2"/>
                    <h3 className="font-headline text-2xl font-bold">Nuestro Menú</h3>
                    <p className="text-muted-foreground mb-4">Descubre las delicias que tenemos para recargar energía.</p>
                    <Button asChild>
                        <Link href="/menu-alimentos">Ver Menú de Alimentos</Link>
                    </Button>
                </Card>
            </div>

            {/* Galería */}
            <Card className="shadow-lg rounded-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Galería de {sucursal.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sucursal.gallery.map((img, index) => (
                        <div key={index} className="overflow-hidden rounded-lg group shadow-md">
                           <Image src={img.src} alt={img.alt} width={600} height={400} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"/>
                        </div>
                    ))}
                </CardContent>
            </Card>

          </div>
        </section>
      </main>
      <WhatsappButton />
      <Footer />
    </div>
  );
}

    