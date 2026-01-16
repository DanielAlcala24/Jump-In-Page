
'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase';

interface Branch {
  id: string;
  name: string;
  slug: string;
  state?: string;
  featured_image?: string;
  is_active: boolean;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_hint?: string;
  available_in: string[];
}

const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: 'default-1',
    title: 'Martes 2x1',
    description: '¡Los martes son de amigos! Compra una hora de salto y obtén la segunda gratis para un acompañante.',
    image_url: '/assets/g5.jpeg',
    image_hint: 'friends jumping',
    available_in: ['Todas las sucursales']
  },
  {
    id: 'default-2',
    title: 'Jueves de Estudiantes',
    description: 'Presenta tu credencial de estudiante vigente y obtén un 20% de descuento en tu entrada.',
    image_url: '/assets/g2.jpg',
    image_hint: 'student discount',
    available_in: ['Coacalco', 'Ecatepec', 'Vallejo']
  },
  {
    id: 'default-3',
    title: 'Domingo Familiar',
    description: 'Paquete familiar (2 adultos, 2 niños) por solo $750 la hora. ¡El plan perfecto para el fin de semana!',
    image_url: '/assets/g8.jpeg',
    image_hint: 'family fun',
    available_in: ['Todas las sucursales']
  },
  {
    id: 'default-4',
    title: 'Promo Cumpleañero',
    description: '¿Es tu mes de cumpleaños? Presenta tu INE y salta ¡GRATIS! en la compra de 3 accesos para tus amigos.',
    image_url: '/assets/g3.jpeg',
    image_hint: 'birthday person',
    available_in: ['Interlomas', 'La Cúspide', 'Cuernavaca']
  },
];

const categories = ['Precios', 'Promociones'];

function PreciosPromocionesContentComponent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'Promociones' ? 'Promociones' : 'Precios';
  const [selectedCategory, setSelectedCategory] = useState(initialTab);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab && categories.includes(newTab)) {
      setSelectedCategory(newTab);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching promotions:', error);
          setPromotions([]);
        } else {
          setPromotions(data && data.length > 0 ? data : []);
        }
      } catch (err) {
        console.error('Error:', err);
        setPromotions([]);
      } finally {
        setLoadingPromotions(false);
      }
    };

    fetchPromotions();
  }, [supabase]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('id, name, slug, state, featured_image, is_active')
          .eq('is_active', true)
          .order('state', { ascending: true })
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching branches:', error);
          setBranches([]);
        } else {
          setBranches(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setBranches([]);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, [supabase]);

  return (
    <section id="content" className="w-full py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-2 md:px-6">
        <div className="sticky top-14 z-30 py-4 mb-8">
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center items-center bg-white border border-gray-200 rounded-full p-1 shadow-lg">
              {categories.map((category, index) => (
                <>
                  <Button
                    key={category}
                    variant="ghost"
                    className={cn(
                      'transition-colors duration-300 text-base font-medium h-auto py-2 px-4',
                      'focus-visible:ring-transparent whitespace-nowrap',
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-primary hover:bg-primary/10',
                      'rounded-full'
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                  {index < categories.length - 1 && (
                    <Separator orientation="vertical" className="h-6 bg-gray-200 last-of-type:hidden" />
                  )}
                </>
              ))}
            </div>
          </div>
        </div>

        {selectedCategory === 'Precios' && (
          <>
            {loadingBranches ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p>Cargando sucursales...</p>
              </div>
            ) : branches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay sucursales disponibles en este momento.</p>
              </div>
            ) : (() => {
              // Agrupar sucursales por estado
              const groupedBranches = branches.reduce((acc, branch) => {
                const state = branch.state || 'Sin Estado';
                if (!acc[state]) {
                  acc[state] = [];
                }
                acc[state].push(branch);
                return acc;
              }, {} as Record<string, Branch[]>);

              const states = Object.keys(groupedBranches).sort();

              return (
                <div className="space-y-12">
                  {states.map((state, stateIndex) => (
                    <div key={state}>
                      {states.length > 1 && (
                        <div className="mb-8 text-center">
                          <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 mb-4">
                            <h2 className="text-2xl font-bold font-headline text-primary">
                              {state}
                            </h2>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {groupedBranches[state].map((branch) => (
                          <Card key={branch.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group">
                            <CardHeader className="p-0">
                              <Image
                                src={branch.featured_image || '/assets/g1.jpg'}
                                alt={`Sucursal ${branch.name}`}
                                width={600}
                                height={400}
                                data-ai-hint="trampoline park"
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </CardHeader>
                            <CardContent className="p-6 flex-grow flex flex-col items-center text-center">
                              <CardTitle className="font-headline text-xl mb-2">{branch.name}</CardTitle>
                              {branch.state && (
                                <Badge variant="outline" className="text-xs">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {branch.state}
                                </Badge>
                              )}
                            </CardContent>
                            <CardFooter className="p-4">
                              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                                <Link href={`/sucursales/${branch.slug}`}>
                                  Checar Precios
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                      {stateIndex < states.length - 1 && (
                        <Separator className="my-8" />
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </>
        )}

        {selectedCategory === 'Promociones' && (
          <>
            <div className="mb-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3" />
                <p className="font-bold text-lg">Importante</p>
              </div>
              <p className="mt-2 text-base">'En temporada vacacional y días festivos las promociones entre semana no aplican'.</p>
            </div>
            {loadingPromotions ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p>Cargando promociones...</p>
              </div>
            ) : promotions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay promociones disponibles en este momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {promotions.map((promo) => (
                  <Card key={promo.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-white dark:bg-gray-950 border-none">
                    <CardHeader className="p-0">
                      <div className="relative w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-2">
                        <Image
                          src={promo.image_url || '/assets/g5.jpeg'}
                          alt={promo.title}
                          width={800}
                          height={1200}
                          data-ai-hint={promo.image_hint || promo.title}
                          className="w-full h-auto object-contain max-h-[600px] shadow-sm rounded-sm"
                          priority
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="font-headline text-2xl text-center mb-3 text-primary">{promo.title}</CardTitle>
                      <CardDescription className="text-base text-center text-gray-700 dark:text-gray-300 mb-4">{promo.description}</CardDescription>
                      <div className="mt-auto border-t pt-4">
                        <h4 className="text-sm font-semibold flex items-center mb-3 justify-center text-muted-foreground uppercase tracking-wider">
                          <MapPin className="mr-2 h-4 w-4" />
                          Disponible en:
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {promo.available_in && promo.available_in.map(sucursal => (
                            <Badge key={sucursal} variant="secondary" className="font-medium bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                              {sucursal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default function PreciosPromocionesContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreciosPromocionesContentComponent />
    </Suspense>
  );
}
