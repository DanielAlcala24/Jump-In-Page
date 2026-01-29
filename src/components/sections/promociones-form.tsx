'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Gift, Calendar, MapPin, User, Mail, Phone } from 'lucide-react';

interface Branch {
    id: string;
    name: string;
}

const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function PromocionesForm() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        birthday_month: '',
        branch_id: ''
    });

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchBranches = async () => {
            const { data, error } = await supabase
                .from('branches')
                .select('id, name')
                .eq('is_active', true)
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching branches:', error);
            } else {
                setBranches(data || []);
            }
        };

        fetchBranches();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('leads')
                .insert([formData]);

            if (error) throw error;

            toast.success('¡Registro exitoso! Pronto recibirás nuestras promociones.');
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                birthday_month: '',
                branch_id: ''
            });
        } catch (error: any) {
            console.error('Error saving lead:', error);
            toast.error('Hubo un error al registrarte. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="promociones-form" className="w-full py-20 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100/50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100/50 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

            <div className="container mx-auto max-w-4xl px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-4">
                        <Gift className="h-8 w-8 text-orange-600" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-headline tracking-tight">
                        ¡Recibe Promociones Exclusivas!
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                        Entérate antes que nadie de nuestros precios especiales, accesos y paquetes para fiestas de cumpleaños.
                    </p>
                </div>

                <Card className="border border-gray-100 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                        <CardTitle className="text-2xl text-gray-900 font-headline">Registro para Promociones</CardTitle>
                        <CardDescription className="text-gray-500">
                            Completa tus datos y selecciona la sucursal de tu interés.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="text-gray-700 flex items-center gap-2">
                                    <User className="h-4 w-4 text-orange-500" /> Nombre Completo
                                </Label>
                                <Input
                                    id="full_name"
                                    required
                                    placeholder="Ej. Juan Pérez"
                                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-orange-500 focus:border-orange-500 h-12"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-orange-500" /> Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="tu@correo.com"
                                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-orange-500 focus:border-orange-500 h-12"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-700 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-orange-500" /> Número Celular
                                </Label>
                                <Input
                                    id="phone"
                                    required
                                    placeholder="10 dígitos"
                                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-orange-500 focus:border-orange-500 h-12"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birthday" className="text-gray-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-orange-500" /> Mes de Cumpleaños (Menor)
                                </Label>
                                <Select
                                    required
                                    onValueChange={(value) => setFormData({ ...formData, birthday_month: value })}
                                    value={formData.birthday_month}
                                >
                                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-12">
                                        <SelectValue placeholder="Selecciona un mes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month) => (
                                            <SelectItem key={month} value={month}>{month}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="branch" className="text-gray-700 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-orange-500" /> Sucursal de Interés
                                </Label>
                                <Select
                                    required
                                    onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
                                    value={formData.branch_id}
                                >
                                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-12">
                                        <SelectValue placeholder="Selecciona una sucursal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="md:col-span-2 bg-orange-500 text-white hover:bg-orange-600 font-bold py-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-xl disabled:opacity-50"
                            >
                                {loading ? 'Registrando...' : '¡Quiero mis Promociones!'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
