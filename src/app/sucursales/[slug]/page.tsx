import { Metadata } from 'next';
import { createServerComponentClient } from '@/lib/supabase-server';
import SucursalClientPage from '@/components/sections/sucursal-client-page';
import { Suspense } from 'react';
import VideoBackground from '@/components/video-background';
import Header from '@/components/header';
import Footer from '@/components/footer';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createServerComponentClient();
  const { data: sucursal } = await supabase
    .from('branches')
    .select('name, state, address')
    .eq('slug', params.slug)
    .single();

  if (!sucursal) return { title: 'Sucursal no encontrada' };

  return {
    title: `Sucursal ${sucursal.name}`,
    description: `Visita Jump-In ${sucursal.name} en ${sucursal.state}. ${sucursal.address}. ¡Reserva tu lugar ahora!`,
    keywords: `Jump-In ${sucursal.name}, sucursal ${sucursal.name}, trampoline park ${sucursal.state}, donde ir en ${sucursal.name}`,
  };
}

export default function SucursalPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <VideoBackground />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SucursalClientPage />
    </Suspense>
  );
}
