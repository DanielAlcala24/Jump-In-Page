'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Home, Download, Trash2, Calendar as CalendarIcon, FilterX } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    birthday_month: string;
    created_at: string;
    branches: {
        name: string;
    };
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/admin/login');
                return;
            }
            setUser(user);
        };

        const fetchLeads = async () => {
            try {
                const { data, error } = await supabase
                    .from('leads')
                    .select(`
            id,
            full_name,
            email,
            phone,
            birthday_month,
            created_at,
            branches ( name )
          `)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching leads:', error);
                    toast.error('Error al cargar los registros');
                } else {
                    setLeads(data as any[] || []);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
        fetchLeads();
    }, [supabase, router]);

    // Filtrado de leads basado en fechas
    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            if (!startDate && !endDate) return true;

            const leadDate = new Date(lead.created_at);
            leadDate.setHours(0, 0, 0, 0); // Normalizar a medianoche para comparación de fechas

            let isAfterStart = true;
            let isBeforeEnd = true;

            if (startDate) {
                const start = new Date(startDate);
                start.setMinutes(start.getMinutes() + start.getTimezoneOffset()); // Ajuste de zona horaria
                start.setHours(0, 0, 0, 0);
                isAfterStart = leadDate >= start;
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setMinutes(end.getMinutes() + end.getTimezoneOffset()); // Ajuste de zona horaria
                end.setHours(23, 59, 59, 999);
                isBeforeEnd = leadDate <= end;
            }

            return isAfterStart && isBeforeEnd;
        });
    }, [leads, startDate, endDate]);

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este registro?')) return;

        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setLeads(leads.filter(lead => lead.id !== id));
            toast.success('Registro eliminado');
        } catch (err) {
            console.error('Error deleting lead:', err);
            toast.error('Error al eliminar el registro');
        }
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
    };

    const downloadCSV = () => {
        if (filteredLeads.length === 0) {
            toast.error('No hay registros para descargar con los filtros actuales');
            return;
        }

        const headers = ['Nombre Completo', 'Email', 'Teléfono', 'Mes Cumpleaños', 'Sucursal', 'Fecha Registro'];
        const csvData = filteredLeads.map(lead => [
            `"${lead.full_name}"`,
            `"${lead.email}"`,
            `"${lead.phone}"`,
            `"${lead.birthday_month}"`,
            `"${lead.branches?.name || 'N/A'}"`,
            `"${new Date(lead.created_at).toLocaleString()}"`
        ]);

        const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);

        const dateRange = (startDate || endDate) ? `_${startDate || 'inicio'}_a_${endDate || 'fin'}` : '';
        link.setAttribute("download", `registros_promociones${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p>Cargando registros...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
                        <div className="flex items-center gap-3">
                            <Link href="/admin">
                                <Button variant="outline">
                                    <Home className="mr-2 h-4 w-4" />
                                    Volver al Panel
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Registros de Promociones</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={downloadCSV} variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                                <Download className="mr-2 h-4 w-4" />
                                Descargar CSV ({filteredLeads.length})
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0 space-y-6">
                    {/* Filtros */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-orange-500" />
                                Filtrar por Fecha
                            </CardTitle>
                            <CardDescription>
                                Selecciona un rango para filtrar la lista y la descarga.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap items-end gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Fecha Inicio</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-[180px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">Fecha Fin</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-[180px]"
                                    />
                                </div>
                                {(startDate || endDate) && (
                                    <Button
                                        variant="ghost"
                                        onClick={clearFilters}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <FilterX className="mr-2 h-4 w-4" />
                                        Limpiar Filtros
                                    </Button>
                                )}
                                <div className="ml-auto text-sm text-gray-500 self-center">
                                    Mostrando <strong>{filteredLeads.length}</strong> de {leads.length} registros
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Base de Datos de Leads</CardTitle>
                            <CardDescription>
                                Personas interesadas en recibir promociones y paquetes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredLeads && filteredLeads.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nombre</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Teléfono</TableHead>
                                                <TableHead>Mes Cumple</TableHead>
                                                <TableHead>Sucursal</TableHead>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredLeads.map((lead) => (
                                                <TableRow key={lead.id}>
                                                    <TableCell className="font-medium">{lead.full_name}</TableCell>
                                                    <TableCell>{lead.email}</TableCell>
                                                    <TableCell>{lead.phone}</TableCell>
                                                    <TableCell>{lead.birthday_month}</TableCell>
                                                    <TableCell>{lead.branches?.name || '---'}</TableCell>
                                                    <TableCell className="text-xs">
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDelete(lead.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    No se encontraron registros en este rango de fechas.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
