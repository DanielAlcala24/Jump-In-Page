import type {NextConfig} from 'next';

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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
