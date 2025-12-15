
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import React from 'react';
import { createClientComponentClient } from '@/lib/supabase';

interface Branch {
  id: string;
  name: string;
  slug: string;
  state?: string;
  featured_image?: string;
  is_active: boolean;
}

export default function SucursalesList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

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
        setLoading(false);
      }
    };

    fetchBranches();
  }, [supabase]);

  // Agrupar sucursales por estado
  const groupedBranches = branches.reduce((acc, branch) => {
    const state = branch.state || 'Sin Estado';
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push({
      name: branch.name,
      image: branch.featured_image || '/assets/g1.jpg',
      link: `/sucursales/${branch.slug}`,
    });
    return acc;
  }, {} as Record<string, Array<{ name: string; image: string; link: string }>>);

  // Convertir el objeto agrupado en array para mostrar
  const sucursalesData = Object.entries(groupedBranches).map(([category, locations]) => ({
    category,
    locations,
  }));

  const categories = sucursalesData.map(g => g.category);

  const filteredSucursales = selectedCategory
    ? sucursalesData.filter(group => group.category === selectedCategory)
    : sucursalesData;

  if (loading) {
    return (
      <section id="sucursales-list" className="w-full py-6 md:py-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando sucursales...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sucursales-list" className="w-full py-6 md:py-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="sticky top-16 z-30 py-4 mb-10">
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center items-center bg-white border border-gray-200 rounded-full p-1 shadow-lg">
              {categories.map((category, index) => (
                <React.Fragment key={category}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'transition-colors duration-300 text-base font-medium h-auto py-2 px-4',
                      'focus-visible:ring-transparent whitespace-nowrap',
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-primary hover:bg-primary/10',
                      'rounded-full'
                    )}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Button>
                  {index < categories.length - 1 && (
                    <Separator orientation="vertical" className="h-6 bg-gray-200 last-of-type:hidden" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {filteredSucursales.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No hay sucursales disponibles en este momento.</p>
          </div>
        ) : (
          filteredSucursales.map((group, index) => (
            <div key={group.category}>
              <div className="mb-16">
                {selectedCategory === null && (
                  <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-headline">
                      {group.category}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                      Encuéntranos en {group.category}
                    </h2>
                  </div>
                )}
                <div className="flex flex-wrap justify-center gap-8">
                  {group.locations.map((sucursal) => (
                    <div
                      key={sucursal.name}
                      className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-950 text-center w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                    >
                      <Link href={sucursal.link} className="block overflow-hidden">
                        <Image
                          src={sucursal.image}
                          alt={`Sucursal ${sucursal.name}`}
                          width={600}
                          height={400}
                          data-ai-hint="trampoline park"
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-4 text-xl font-bold font-headline text-gray-900 dark:text-gray-50">
                          {sucursal.name}
                        </h3>
                        <Link href={sucursal.link} className="mt-auto">
                          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-transform group-hover:scale-105">
                            <MapPin className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedCategory === null && index < filteredSucursales.length - 1 && (
                <hr className="my-16" />
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
