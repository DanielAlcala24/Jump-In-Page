'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Ticket, AlertTriangle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Branch {
  id: string;
  name: string;
  slug: string;
  state: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_hint?: string;
  available_in: string[];
}

function PreciosPromocionesContentComponent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'Precios';
  const [selectedCategory, setSelectedCategory] = useState(initialTab);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPromoIndex, setSelectedPromoIndex] = useState(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchBranches();
    fetchPromotions();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setSelectedCategory(tab);
  }, [searchParams]);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('id, name, slug, state')
        .eq('is_active', true)
        .order('state', { ascending: true });

      if (error) {
        console.error('Error fetching branches:', error);
      } else {
        setBranches(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoadingBranches(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching promotions:', error);
      } else {
        setPromotions(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoadingPromotions(false);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedPromoIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    setSelectedPromoIndex((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedPromoIndex((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="content" className="w-full py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-white dark:bg-gray-800 rounded-full shadow-md border">
            <button
              onClick={() => setSelectedCategory('Precios')}
              className={`px-8 py-2 rounded-full text-base font-bold transition-all ${selectedCategory === 'Precios'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              Precios
            </button>
            <button
              onClick={() => setSelectedCategory('Promociones')}
              className={`px-8 py-2 rounded-full text-base font-bold transition-all ${selectedCategory === 'Promociones'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              Promociones
            </button>
          </div>
        </div>

        {selectedCategory === 'Precios' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingBranches ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p>Cargando información...</p>
              </div>
            ) : branches.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No hay información de sucursales disponible.</p>
              </div>
            ) : (
              branches.map((branch) => (
                <Card key={branch.id} className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white dark:bg-gray-950">
                  <CardHeader className="bg-primary/5 p-6 border-b">
                    <CardTitle className="font-headline text-2xl flex items-center justify-between">
                      {branch.name}
                      <span className="text-sm font-normal bg-orange-100 text-orange-700 px-3 py-1 rounded-full">{branch.state}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Consulta las tarifas y paquetes disponibles para esta sucursal.</p>
                    <a href={`/sucursales/${branch.slug}#precios`} className="w-full">
                      <div className="w-full bg-primary hover:bg-primary/90 text-white text-center py-3 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-bold group-hover:scale-[1.02]">
                        <Ticket className="h-5 w-5" />
                        Ver Precios de {branch.name}
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {promotions.map((promo, index) => (
                  <Card key={promo.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-white dark:bg-gray-950 border-none">
                    <CardHeader className="p-0">
                      <div
                        className="relative w-full cursor-pointer overflow-hidden flex items-center justify-center bg-white"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={promo.image_url || '/assets/g5.jpeg'}
                          alt={promo.title}
                          className="w-full h-auto shadow-sm rounded-sm transition-transform duration-300 hover:scale-[1.02]"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="font-headline text-2xl text-center mb-3 text-primary">{promo.title}</CardTitle>
                      <CardDescription className="text-base text-center text-gray-700 dark:text-gray-300 mb-4">{promo.description}</CardDescription>
                      <div className="border-t pt-4">
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
            {/* Lightbox para Promociones */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogContent className="bg-black/90 border-none p-0 max-w-none w-screen h-screen flex items-center justify-center">
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
                    onClick={() => setLightboxOpen(false)}
                  >
                    <X className="h-8 w-8" />
                    <span className="sr-only">Cerrar</span>
                  </Button>

                  <div className="flex items-center justify-center w-full h-full p-4 md:p-8">
                    {promotions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12 hidden md:flex"
                        onClick={goToPrevious}
                      >
                        <ChevronLeft className="h-10 w-10" />
                        <span className="sr-only">Anterior</span>
                      </Button>
                    )}

                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={promotions[selectedPromoIndex]?.image_url || ''}
                        alt={promotions[selectedPromoIndex]?.title || ''}
                        className="max-w-full max-h-full object-contain shadow-2xl"
                      />
                    </div>

                    {promotions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12 hidden md:flex"
                        onClick={goToNext}
                      >
                        <ChevronRight className="h-10 w-10" />
                        <span className="sr-only">Siguiente</span>
                      </Button>
                    )}
                  </div>
                  <div className="absolute bottom-10 left-0 right-0 text-center text-white px-4">
                    <h3 className="text-xl md:text-2xl font-bold font-headline">
                      {promotions[selectedPromoIndex]?.title}
                    </h3>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
