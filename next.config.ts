import type { NextConfig } from 'next';

// Extraer el hostname de Supabase desde la variable de entorno
const getSupabaseHostname = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl);
      return url.hostname;
    } catch (e) {
      console.warn('No se pudo parsear NEXT_PUBLIC_SUPABASE_URL');
    }
  }
  return null;
};

const supabaseHostname = getSupabaseHostname();

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    nodeMiddleware: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },


  // 1. SECCIÓN DE REDIRECCIONES PARA SEO
  async redirects() {
    return [
      {
        // Si Google indexó /precios-y-promociones (común en WordPress)
        source: '/menu',
        destination: '/menu-alimentos',
        permanent: true,
      },
      {
        // Si Google indexó /precios-y-promociones (común en WordPress)
        source: '/alimentos',
        destination: '/menu-alimentos',
        permanent: true,
      },
      {
        // Si Google indexó /precios-y-promociones (común en WordPress)
        source: '/snacks',
        destination: '/menu-alimentos',
        permanent: true,
      },
      {
        // Si la URL vieja era /sucursales-jumpin o similar
        source: '/teambuilding',
        destination: '/fiestas-y-eventos/eventos-empresariales',
        permanent: true,
      },
      {
        // Si la URL vieja era /sucursales-jumpin o similar
        source: '/sucursal-la-cuspide',
        destination: '/sucursales/la-cuspide',
        permanent: true,
      },
      {
        // Si la URL vieja era /sucursales-jumpin o similar
        source: '/sucursal-churubusco',
        destination: '/sucursales/churubusco',
        permanent: true,
      },
      {
        // Si la URL vieja era /sucursales-jumpin o similar
        source: '/sucursal-interlomas',
        destination: '/sucursales/interlomas',
        permanent: true,
      },
      {
        // Si la URL vieja era /sucursales-jumpin o similar
        source: '/sucursal-miramontes',
        destination: '/sucursales/miramontes',
        permanent: true,
      },
      {
        // Si la URL vieja era /sucursales-jumpin o similar
        source: '/sucursal-vallejo',
        destination: '/sucursales/vallejo',
        permanent: true,
      },
      {
        // Si la URL vieja era /sucursales-jumpin o similar
        source: '/sucursal-ecatepec',
        destination: '/sucursales/ecatepec',
        permanent: true,
      },
      {
        // Si la URL vieja era /sucursales-jumpin o similar
        source: '/sucursal-coacalco',
        destination: '/sucursales/coacalco',
        permanent: true,
      },
      {
        // Si la URL vieja era /sucursales-jumpin o similar
        source: '/sucursal-cuernavaca',
        destination: '/sucursales/cuernavaca',
        permanent: true,
      },
      // Puedes añadir aquí cualquier otro enlace viejo que de 404
    ];
  },


  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.jumpin.com.mx',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jumpin.com.mx',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'supabase.co',
        port: '',
        pathname: '/**',
      },
      // Agregar el hostname específico de Supabase si está disponible
      ...(supabaseHostname ? [{
        protocol: 'https' as const,
        hostname: supabaseHostname,
        port: '',
        pathname: '/**',
      }] : []),
    ],
  },
};

export default nextConfig;


