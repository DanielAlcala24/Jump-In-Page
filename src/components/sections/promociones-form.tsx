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
    const [emailError, setEmailError] = useState(false);
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
        setEmailError(false);

        try {
            // 1. Verificación de Email con Emailable (vía nuestra API interna)
            const verifyRes = await fetch(`/api/verify-email?email=${encodeURIComponent(formData.email)}`);
            const verifyData = await verifyRes.json();

            if (!verifyData.isValid) {
                toast.error('Por favor, ingresa un correo electrónico verídico y activo.');
                setEmailError(true);
                setLoading(false);
                return;
            }

            // 2. Registro en Supabase si el correo es válido
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
            setEmailError(false);
        } catch (error: any) {
            console.error('Error saving lead:', error);
            toast.error('Hubo un error al procesar tu registro. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="promociones-form" className="w-full py-24 bg-gradient-to-br from-orange-500 to-blue-600 relative overflow-hidden">
            {/* Decorative elements for the "difuminado" effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-400/30 rounded-full translate-x-1/4 -translate-y-1/4 blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/30 rounded-full -translate-x-1/4 translate-y-1/4 blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black/5 pointer-events-none" />

            <div className="container mx-auto max-w-4xl px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-md rounded-3xl mb-6 shadow-xl border border-white/30">
                        <Gift className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 font-headline tracking-tighter drop-shadow-lg">
                        ¡Recibe Promociones Exclusivas!
                    </h2>
                    <p className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto font-medium drop-shadow">
                        Entérate antes que nadie de nuestros precios especiales, accesos y paquetes para fiestas de cumpleaños.
                    </p>
                </div>

                <Card className="border-none bg-white/10 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden rounded-[2.5rem] border border-white/20">
                    <CardHeader className="bg-white/10 border-b border-white/10 p-10">
                        <CardTitle className="text-3xl text-white font-headline tracking-tight">Registro para Promociones</CardTitle>
                        <CardDescription className="text-white/80 text-lg">
                            Completa tus datos y selecciona la sucursal de tu interés.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-10">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
                            <div className="space-y-3">
                                <Label htmlFor="full_name" className="text-white text-base font-semibold flex items-center gap-2">
                                    <User className="h-5 w-5 text-orange-300" /> Nombre Completo
                                </Label>
                                <Input
                                    id="full_name"
                                    required
                                    placeholder="Ej. Juan Pérez"
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/50 focus:border-white h-14 rounded-2xl text-lg transition-all"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="email" className={`${emailError ? 'text-red-300' : 'text-white'} text-base font-semibold flex items-center gap-2 transition-colors`}>
                                    <Mail className={`h-5 w-5 ${emailError ? 'text-red-400' : 'text-orange-300'}`} /> Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="tu@correo.com"
                                    className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 rounded-2xl text-lg transition-all ${emailError ? 'border-red-400 ring-2 ring-red-400/50 bg-red-500/10' : 'focus:ring-2 focus:ring-white/50 focus:border-white'}`}
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        setEmailError(false);
                                    }}
                                />
                                {emailError && <p className="text-sm text-red-300 font-medium px-1 animate-pulse">Este correo no parece ser válido.</p>}
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="phone" className="text-white text-base font-semibold flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-orange-300" /> Número Celular
                                </Label>
                                <Input
                                    id="phone"
                                    required
                                    placeholder="10 dígitos"
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/50 focus:border-white h-14 rounded-2xl text-lg transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="birthday" className="text-white text-base font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-orange-300" /> Mes de Cumpleaños (Menor)
                                </Label>
                                <Select
                                    required
                                    onValueChange={(value) => setFormData({ ...formData, birthday_month: value })}
                                    value={formData.birthday_month}
                                >
                                    <SelectTrigger className="bg-white/10 border-white/20 text-white h-14 rounded-2xl text-lg focus:ring-2 focus:ring-white/50">
                                        <SelectValue placeholder="Selecciona un mes" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {months.map((month) => (
                                            <SelectItem key={month} value={month} className="focus:bg-orange-500 focus:text-white">{month}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <Label htmlFor="branch" className="text-white text-base font-semibold flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-orange-300" /> Sucursal de Interés
                                </Label>
                                <Select
                                    required
                                    onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
                                    value={formData.branch_id}
                                >
                                    <SelectTrigger className="bg-white/10 border-white/20 text-white h-14 rounded-2xl text-lg focus:ring-2 focus:ring-white/50">
                                        <SelectValue placeholder="Selecciona una sucursal" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id} className="focus:bg-orange-500 focus:text-white">{branch.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="md:col-span-2 bg-white text-blue-700 hover:bg-orange-50 font-bold py-8 rounded-[1.5rem] text-xl transition-all duration-300 transform hover:scale-[1.03] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] disabled:opacity-50 active:scale-95"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                                        Validando...
                                    </div>
                                ) : '¡Quiero mis Promociones!'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
