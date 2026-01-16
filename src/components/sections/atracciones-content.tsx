
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';

interface Branch {
    id: string;
    name: string;
    is_active: boolean;
}

interface Attraction {
    id: string;
    name: string;
    category: string;
    available_in: string[];
    image_url: string;
    image_hint?: string;
}

export default function AtraccionesContent() {
    const [selectedSucursal, setSelectedSucursal] = useState('Todas las sucursales');
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingBranches, setLoadingBranches] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const { data, error } = await supabase
                    .from('attractions')
                    .select('*')
                    .order('category', { ascending: true })
                    .order('name', { ascending: true });

                if (error) {
                    console.error('Error fetching attractions:', error);
                    setAttractions([]);
                } else {
                    setAttractions(data || []);
                }
            } catch (err) {
                console.error('Error:', err);
                setAttractions([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchBranches = async () => {
            try {
                const { data, error } = await supabase
                    .from('branches')
                    .select('id, name, is_active')
                    .eq('is_active', true)
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

        fetchAttractions();
        fetchBranches();
    }, [supabase]);

    const filteredAttractions = attractions.filter(attraction =>
        selectedSucursal === 'Todas las sucursales' || (attraction.available_in && attraction.available_in.includes(selectedSucursal))
    );

    const categories = Array.from(new Set(attractions.map(attr => attr.category).filter(Boolean)));

    const renderedCategories = categories.filter(category =>
        filteredAttractions.some(attr => attr.category === category)
    );

    if (loading || loadingBranches) {
        return (
            <section id="attractions-content" className="w-full py-6 md:py-6 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto max-w-7xl px-4 md:px-6">
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Cargando atracciones...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (renderedCategories.length === 0) {
        return null;
    }

    return (
        <section id="attractions-content" className="w-full py-6 md:py-6 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 sticky top-16 z-20 py-4">
                    <Select onValueChange={setSelectedSucursal} defaultValue="Todas las sucursales">
                        <SelectTrigger className="w-full sm:w-[280px] shadow-lg">
                            <SelectValue placeholder="Selecciona una sucursal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todas las sucursales">Todas las sucursales</SelectItem>
                            {branches.map(branch => (
                                <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {renderedCategories.map((category, index) => {
                    const attractionsInCategory = filteredAttractions.filter(attr => attr.category === category);
                    if (attractionsInCategory.length === 0) return null;

                    return (
                        <div key={category}>
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                                    {category}
                                </h2>
                                {category === 'Atracciones para los más pequeños' && <p className="text-muted-foreground mt-2">(Menores de 1.50m)</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {attractionsInCategory.map(attraction => (
                                    <Card key={attraction.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group">
                                        <CardHeader className="p-0 relative">
                                            <Image
                                                src={attraction.image_url || '/assets/atracciones/exclusivas/climbingwall.jpg'}
                                                alt={attraction.name}
                                                width={400}
                                                height={300}
                                                data-ai-hint={attraction.image_hint || attraction.name}
                                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </CardHeader>
                                        <CardContent className="p-6 flex-grow flex flex-col">
                                            <CardTitle className="font-headline text-2xl text-center mb-4">{attraction.name}</CardTitle>
                                            <div className="flex-grow">
                                                <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center justify-center">
                                                    <MapPin className="mr-1 h-4 w-4" />
                                                    Disponible en:
                                                </h4>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {attraction.available_in && attraction.available_in.length > 0 ? (
                                                        attraction.available_in.map(sucursal => (
                                                            <Badge key={sucursal} variant="outline" className="font-normal bg-blue-100 text-blue-800 border-blue-300">{sucursal}</Badge>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No disponible</p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {index < renderedCategories.length - 1 && (
                                <hr className="my-12" />
                            )}
                        </div>
                    );
                })}
                {filteredAttractions.length === 0 && selectedSucursal !== 'Todas las sucursales' && !loading && (
                    <div className="text-center py-16">
                        <p className="text-2xl font-semibold text-muted-foreground">No se encontraron atracciones para la sucursal seleccionada.</p>
                        <p className="text-muted-foreground mt-2">Prueba seleccionando "Todas las sucursales" para ver todas las atracciones disponibles.</p>
                    </div>
                )}
            </div>
        </section>
    )
}
