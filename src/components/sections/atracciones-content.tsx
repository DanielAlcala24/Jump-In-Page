
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const sucursales = ['Todas', 'Churubusco', 'Coacalco', 'Interlomas', 'Ecatepec', 'Vallejo', 'La Cúspide', 'Miramontes', 'Cuernavaca'];

const attractionsData = [
    // Atracciones exclusivas
    { name: 'Climbing Wall', availableIn: ['Churubusco', 'Coacalco', 'Interlomas', 'Ecatepec', 'Vallejo'], category: 'Atracciones Exclusivas', image: '/assets/g6.jpeg', hint: 'climbing wall' },
    { name: 'Arena Futbol', availableIn: ['La Cúspide', 'Miramontes', 'Interlomas'], category: 'Atracciones Exclusivas', image: '/assets/g5.jpeg', hint: 'soccer arena' },
    { name: 'Escape Room', availableIn: ['Miramontes'], category: 'Atracciones Exclusivas', image: '/assets/g7.jpeg', hint: 'escape room' },
    { name: 'Drope Slide', availableIn: ['Ecatepec'], category: 'Atracciones Exclusivas', image: '/assets/g4.jpeg', hint: 'drop slide' },
    { name: 'Camino al Cielo', availableIn: ['La Cúspide', 'Interlomas', 'Ecatepec'], category: 'Atracciones Exclusivas', image: '/assets/g6.jpeg', hint: 'heaven path' },
    { name: 'Ball Blaster', availableIn: ['Cuernavaca', 'Ecatepec'], category: 'Atracciones Exclusivas', image: '/assets/g4.jpeg', hint: 'ball blaster' },
    { name: 'Juegos de Destreza', availableIn: ['Churubusco', 'Coacalco', 'Interlomas', 'Ecatepec', 'Vallejo', 'La Cúspide', 'Miramontes', 'Cuernavaca'], category: 'Atracciones Exclusivas', image: '/assets/g4.jpeg', hint: 'skill games' },

    // Trampolines
    { name: 'Main Court', availableIn: ['Churubusco', 'Coacalco', 'Interlomas', 'Ecatepec', 'Vallejo', 'La Cúspide', 'Miramontes', 'Cuernavaca'], category: 'Trampolines', image: '/assets/g1.jpg', hint: 'trampoline court' },
    { name: 'Jump Jam', availableIn: ['Churubusco', 'Coacalco', 'Interlomas', 'Ecatepec', 'Vallejo', 'La Cúspide', 'Miramontes', 'Cuernavaca'], category: 'Trampolines', image: '/assets/g2.jpg', hint: 'basketball trampoline' },
    { name: 'Dodge Ball', availableIn: ['Churubusco', 'Coacalco', 'Interlomas', 'Ecatepec', 'Vallejo', 'La Cúspide', 'Miramontes', 'Cuernavaca'], category: 'Trampolines', image: '/assets/g5.jpeg', hint: 'dodgeball game' },
    { name: 'Foam Pit', availableIn: ['Churubusco', 'Coacalco', 'Interlomas', 'Ecatepec', 'Vallejo', 'La Cúspide', 'Miramontes', 'Cuernavaca'], category: 'Trampolines', image: '/assets/g4.jpeg', hint: 'foam pit' },

    // Atracciones para los más pequeños
    { name: 'Laberinto de Obstáculos', availableIn: ['La Cúspide', 'Interlomas', 'Ecatepec', 'Churubusco'], category: 'Atracciones para los más pequeños', image: '/assets/g8.jpeg', hint: 'kids labyrinth' },
    { name: 'Spider Tower', availableIn: ['Coacalco', 'Cuernavaca', 'La Cúspide', 'Ecatepec'], category: 'Atracciones para los más pequeños', image: '/assets/g8.jpeg', hint: 'spider tower' },
    { name: 'Kid Zone', availableIn: ['Cuernavaca', 'La Cúspide', 'Interlomas', 'Ecatepec', 'Churubusco', 'Miramontes'], category: 'Atracciones para los más pequeños', image: '/assets/g8.jpeg', hint: 'kids zone' },
    { name: 'Rope Course Kids', availableIn: ['Cuernavaca', 'Churubusco', 'La Cúspide', 'Interlomas', 'Miramontes'], category: 'Atracciones para los más pequeños', image: '/assets/g6.jpeg', hint: 'kids ropes' },

    // Atracciones extremas
    { name: 'Ninja', availableIn: ['Ecatepec'], category: 'Atracciones extremas', image: '/assets/g6.jpeg', hint: 'Ninja'},
    { name: 'Ropes Course', availableIn: ['Ecatepec', 'Interlomas', 'La Cúspide', 'Miramontes', 'Churubusco'], category: 'Atracciones extremas', image: '/assets/g6.jpeg', hint: 'Ropes Course'},
];

const categories = [
    'Atracciones Exclusivas',
    'Trampolines',
    'Atracciones para los más pequeños',
    'Atracciones extremas',
]

export default function AtraccionesContent() {
    const [selectedSucursal, setSelectedSucursal] = useState('Todas');

    const filteredAttractions = attractionsData.filter(attraction => 
        selectedSucursal === 'Todas' || attraction.availableIn.includes(selectedSucursal)
    );

    return (
        <section id="attractions-content" className="w-full py-6 md:py-6 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 sticky top-16 z-20 py-4">
                    <Select onValueChange={setSelectedSucursal} defaultValue="Todas">
                        <SelectTrigger className="w-full sm:w-[280px] shadow-lg">
                            <SelectValue placeholder="Selecciona una sucursal" />
                        </SelectTrigger>
                        <SelectContent>
                            {sucursales.map(sucursal => (
                                <SelectItem key={sucursal} value={sucursal}>{sucursal}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                {categories.map(category => {
                    const attractionsInCategory = filteredAttractions.filter(attr => attr.category === category);
                    if (attractionsInCategory.length === 0) return null;
                    
                    return (
                        <div key={category} className="mb-16">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                                    {category}
                                </h2>
                                {category === 'Atracciones para los más pequeños' && <p className="text-muted-foreground mt-2">(Menores de 1.50m)</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {attractionsInCategory.map(attraction => (
                                    <Card key={attraction.name} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group">
                                        <CardHeader className="p-0 relative">
                                            <Image src={attraction.image} alt={attraction.name} width={400} height={300} data-ai-hint={attraction.hint} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"/>
                                        </CardHeader>
                                        <CardContent className="p-6 flex-grow flex flex-col">
                                            <CardTitle className="font-headline text-2xl text-center mb-4">{attraction.name}</CardTitle>
                                            <div className="flex-grow">
                                                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Disponible en:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {attraction.availableIn.map(sucursal => (
                                                        <Badge key={sucursal} variant="secondary" className="font-normal">{sucursal}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
                 {filteredAttractions.length === 0 && selectedSucursal !== 'Todas' && (
                    <div className="text-center py-16">
                        <p className="text-2xl font-semibold text-muted-foreground">No se encontraron atracciones para la sucursal seleccionada.</p>
                        <p className="text-muted-foreground mt-2">Prueba seleccionando "Todas" para ver todas las atracciones disponibles.</p>
                    </div>
                 )}
            </div>
        </section>
    )
}
