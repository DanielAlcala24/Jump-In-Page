'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SocialIcons from '@/components/social-icons';
import WhatsappButton from '@/components/whatsapp-button';
import VideoBackground from '@/components/video-background';
import Link from 'next/link';
import { ChevronDown, MapPin, Clock, Phone, Ticket, Utensils, PartyPopper, Users, ArrowRight, X, ChevronLeft, ChevronRight, Cake } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { createClientComponentClient } from '@/lib/supabase';

interface Price {
    title: string;
    price: string;
    description: string;
    image: string;
}

interface Attraction {
    name: string;
    image: string;
}

interface GalleryItem {
    src: string;
    alt: string;
}

interface Branch {
    id: string;
    name: string;
    slug: string;
    state?: string;
    address?: string;
    map_link?: string;
    phone?: string;
    whatsapp?: string;
    horarios?: string[];
    prices?: Price[];
    attractions?: Attraction[];
    gallery?: GalleryItem[];
    featured_image?: string;
    is_active: boolean;
}

export default function SucursalClientPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [sucursal, setSucursal] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(true);
    const [attractionsLightbox, setAttractionsLightbox] = useState(false);
    const [pricesLightbox, setPricesLightbox] = useState(false);
    const [selectedImage, setSelectedImage] = useState({ list: 'attractions' as 'attractions' | 'prices', index: 0 });
    const supabase = createClientComponentClient();

    useEffect(() => {
        if (slug) {
            fetchBranch();
        }
    }, [slug]);

    const fetchBranch = async () => {
        try {
            const { data, error } = await supabase
                .from('branches')
                .select('*')
                .eq('slug', slug)
                .eq('is_active', true)
                .single();

            if (error || !data) {
                setSucursal(null);
                return;
            }

            setSucursal(data as Branch);
        } catch (err) {
            console.error('Error fetching branch:', err);
            setSucursal(null);
        } finally {
            setLoading(false);
        }
    };

    const openLightbox = (list: 'attractions' | 'prices', index: number) => {
        setSelectedImage({ list, index });
        if (list === 'attractions') setAttractionsLightbox(true);
        if (list === 'prices') setPricesLightbox(true);
    };

    const closeLightbox = (list: 'attractions' | 'prices') => {
        if (list === 'attractions') setAttractionsLightbox(false);
        if (list === 'prices') setPricesLightbox(false);
    };

    const goToPrevious = () => {
        if (!sucursal) return;
        const { list, index } = selectedImage;
        const imageList = list === 'attractions' ? (sucursal.attractions || []) : (sucursal.prices || []);
        const newIndex = index === 0 ? imageList.length - 1 : index - 1;
        setSelectedImage({ list, index: newIndex });
    };

    const goToNext = () => {
        if (!sucursal) return;
        const { list, index } = selectedImage;
        const imageList = list === 'attractions' ? (sucursal.attractions || []) : (sucursal.prices || []);
        const newIndex = index === imageList.length - 1 ? 0 : index + 1;
        setSelectedImage({ list, index: newIndex });
    };

    const extractMapUrl = (mapLink: string): string | null => {
        if (!mapLink) return null;

        let mapUrl = mapLink.trim();

        const iframeMatch = mapUrl.match(/<iframe[^>]+src=["']([^"']+)["']/i);
        if (iframeMatch && iframeMatch[1]) {
            mapUrl = iframeMatch[1];
        }

        if (mapUrl.includes('google.com/maps') && !mapUrl.includes('/embed')) {
            const urlObj = new URL(mapUrl);
            const q = urlObj.searchParams.get('q');
            if (q) {
                mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.5!2d-99.1!3d19.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI0JzAwLjAiTiA5OcKwMDYnMDAuMCJX!5e0!3m2!1ses!2smx!4v1234567890&q=${encodeURIComponent(q)}`;
            }
        }

        if (!mapUrl.startsWith('http://') && !mapUrl.startsWith('https://')) {
            return null;
        }

        return mapUrl;
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <VideoBackground />
                <Header />
                <SocialIcons />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Cargando sucursal...</p>
                    </div>
                </main>
                <WhatsappButton />
                <Footer />
            </div>
        );
    }

    if (!sucursal) {
        return (
            <div className="flex flex-col min-h-screen">
                <VideoBackground />
                <Header />
                <SocialIcons />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Sucursal no encontrada</h1>
                        <Link href="/sucursales">
                            <Button>Volver a Sucursales</Button>
                        </Link>
                    </div>
                </main>
                <WhatsappButton />
                <Footer />
            </div>
        );
    }

    const currentImageList = selectedImage.list === 'attractions' ? (sucursal.attractions || []) : (sucursal.prices || []);
    const prices = sucursal.prices || [];
    const attractions = sucursal.attractions || [];
    const gallery = sucursal.gallery || [];
    const horarios = sucursal.horarios || [];

    return (
        <div className="flex flex-col min-h-screen">
            <VideoBackground />
            <Header />
            <SocialIcons />
            <main className="flex-1">
                <section className="relative flex h-[50vh] w-full flex-col items-center justify-center text-center text-white">
                    <div className="relative z-10 mx-4 flex flex-col items-center">
                        <div className="flex justify-center items-center gap-1 mb-2">
                            <Image
                                src="/assets/bongo.png"
                                alt="Mascota Bongo"
                                width={50}
                                height={50}
                                className="h-auto w-10 md:w-20"
                            />
                            <Image
                                src="/assets/maya.png"
                                alt="Mascota Maya"
                                width={50}
                                height={50}
                                className="h-auto w-10 md:w-20"
                            />
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl font-headline">
                            Jump-In {sucursal.name}
                        </h1>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link href="/fiestas-y-eventos/fiestas-cumpleanos">
                                <Button size="lg" variant="outline" className="border-background/50 text-background backdrop-blur-sm bg-pink-500/30 hover:bg-pink-500/40">
                                    <Cake className="mr-2 h-5 w-5" />
                                    Cotiza tu Cumpleaños
                                </Button>
                            </Link>
                        </div>
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
                        {sucursal.address && (
                            <Card className="shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                                        <MapPin className="text-primary" /> Dirección
                                    </CardTitle>
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
                                    {sucursal.map_link && (() => {
                                        const mapUrl = extractMapUrl(sucursal.map_link);
                                        if (!mapUrl) return null;

                                        return (
                                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                                <iframe
                                                    src={mapUrl}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    allowFullScreen
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    title={`Mapa de ${sucursal.name}`}
                                                />
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        )}

                        {/* Horarios y Contacto */}
                        {(horarios.length > 0 || sucursal.phone || sucursal.whatsapp) && (
                            <div className="flex justify-center">
                                <Card className="shadow-lg rounded-2xl text-center max-w-md w-full">
                                    <CardHeader className="items-center">
                                        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                                            <Clock className="text-primary" /> Horarios y Contacto
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {horarios.length > 0 && horarios.map((horario, index) => (
                                            <p key={index} className="text-lg text-muted-foreground">{horario}</p>
                                        ))}
                                        {(sucursal.phone || sucursal.whatsapp) && (
                                            <>
                                                <CardTitle className="flex items-center justify-center gap-2 font-headline text-xl mt-8">
                                                    <Phone className="text-primary" /> Contacto
                                                </CardTitle>
                                                {sucursal.phone && (
                                                    <p className="text-lg text-muted-foreground mt-4">Teléfono: {sucursal.phone}</p>
                                                )}
                                                {sucursal.whatsapp && (
                                                    <Button asChild className="mt-2 bg-green-500 hover:bg-green-600">
                                                        <Link href={`https://wa.me/${sucursal.whatsapp}`} target="_blank">
                                                            WhatsApp: {sucursal.phone || sucursal.whatsapp}
                                                        </Link>
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Precios */}
                        {prices.length > 0 && (
                            <Card className="shadow-lg rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                                        <Ticket className="text-primary" /> Precios
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-3 gap-6">
                                    {prices.map((price, index) => (
                                        <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border-none bg-white dark:bg-gray-950 flex flex-col">
                                            {price.image && (
                                                <div className="cursor-pointer bg-gray-100 dark:bg-gray-800 p-2 flex items-center justify-center aspect-[3/4]" onClick={() => openLightbox('prices', index)}>
                                                    <Image
                                                        src={price.image}
                                                        alt={price.title}
                                                        width={600}
                                                        height={800}
                                                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-4 text-center">
                                                <h4 className="font-bold text-xl mb-2">{price.title}</h4>
                                                <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-base font-bold text-primary font-headline mb-2">
                                                    {price.price}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{price.description}</p>
                                            </div>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Atracciones */}
                        {attractions.length > 0 && (
                            <Card className="shadow-lg rounded-2xl">
                                <CardHeader className="text-center">
                                    <CardTitle className="font-headline text-3xl">Atracciones en {sucursal.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {attractions.map((attr, index) => (
                                        <div
                                            key={index}
                                            className="relative group overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
                                            onClick={() => openLightbox('attractions', index)}
                                        >
                                            <Image
                                                src={attr.image || '/assets/g1.jpg'}
                                                alt={attr.name}
                                                fill
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <h4 className="text-white text-xl font-bold font-headline text-center">{attr.name}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Fiestas y Eventos */}
                        <Card className="shadow-lg rounded-2xl bg-primary text-primary-foreground text-center p-8">
                            <PartyPopper className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="font-headline text-3xl font-bold">Fiestas y Eventos en {sucursal.name}</h3>
                            <p className="max-w-2xl mx-auto my-4">Celebra tu cumpleaños o evento de empresa con nosotros para una experiencia inolvidable llena de diversión y adrenalina.</p>
                            <Button variant="secondary" size="lg" asChild>
                                <Link href={`/fiestas-y-eventos/fiestas-cumpleanos`}>
                                    Cotizar mi Evento en {sucursal.name} <ArrowRight className="ml-2" />
                                </Link>
                            </Button>
                        </Card>

                        {/* Registro Digital y Menú */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                <Users className="h-10 w-10 text-primary mb-2" />
                                <h3 className="font-headline text-2xl font-bold">Agiliza tu Entrada</h3>
                                <p className="text-muted-foreground mb-4">Regístrate antes de tu visita a {sucursal.name} aquí.</p>
                                <Button asChild>
                                    <Link href="http://decmanager.com:140" target="_blank">Registro Digital</Link>
                                </Button>
                            </Card>
                            <Card className="shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                <Utensils className="h-10 w-10 text-primary mb-2" />
                                <h3 className="font-headline text-2xl font-bold">Nuestro Menú</h3>
                                <p className="text-muted-foreground mb-4">Descubre las delicias que tenemos para recargar energía.</p>
                                <Button asChild>
                                    <Link href="/menu-alimentos">Ver Menú de Alimentos</Link>
                                </Button>
                            </Card>
                        </div>

                        {/* Galería */}
                        {gallery.length > 0 && (
                            <Card className="shadow-lg rounded-2xl">
                                <CardHeader className="text-center">
                                    <CardTitle className="font-headline text-3xl">Galería de {sucursal.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {gallery.map((img, index) => (
                                        <div key={index} className="overflow-hidden rounded-lg group shadow-md">
                                            <Image
                                                src={img.src || '/assets/g1.jpg'}
                                                alt={img.alt || `Imagen ${index + 1} de ${sucursal.name}`}
                                                width={600}
                                                height={400}
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </section>
            </main>
            {(attractionsLightbox || pricesLightbox) && currentImageList.length > 0 && (
                <Dialog open={attractionsLightbox || pricesLightbox} onOpenChange={() => closeLightbox(selectedImage.list)}>
                    <DialogContent className="bg-black/80 border-none p-0 max-w-none w-screen h-screen flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-50 text-white hover:text-white/80 hover:bg-black/50 rounded-full"
                                onClick={() => closeLightbox(selectedImage.list)}
                            >
                                <X className="h-8 w-8" />
                                <span className="sr-only">Cerrar</span>
                            </Button>
                            <div className="flex items-center justify-center h-full w-full">
                                {currentImageList.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-white/80 hover:bg-black/50 rounded-full h-12 w-12"
                                        onClick={goToPrevious}
                                    >
                                        <ChevronLeft className="h-10 w-10" />
                                        <span className="sr-only">Anterior</span>
                                    </Button>
                                )}
                                <div className="relative w-full max-w-4xl h-full max-h-[80vh]">
                                    <Image
                                        src={(currentImageList[selectedImage.index] as any).image || '/assets/g1.jpg'}
                                        alt={(currentImageList[selectedImage.index] as any).name || (currentImageList[selectedImage.index] as any).title || 'Imagen'}
                                        fill
                                        className="object-contain"
                                        quality={100}
                                    />
                                </div>
                                {currentImageList.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-white/80 hover:bg-black/50 rounded-full h-12 w-12"
                                        onClick={goToNext}
                                    >
                                        <ChevronRight className="h-10 w-10" />
                                        <span className="sr-only">Siguiente</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <WhatsappButton />
            <Footer />
        </div>
    );
}
