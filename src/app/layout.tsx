import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SonnerToaster } from '@/components/sonner-toaster';
import Popup from '@/components/popup';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jumpin.com.mx'),
  title: {
    default: 'Jump-In | El Primer Trampoline Park en México',
    template: '%s | Jump-In'
  },
  description: 'Jump-In: El Primer Trampoline Park en México. Diversión, entretenimiento y deporte para toda la familia.',
  icons: {
    icon: '/favicon.ico',
    apple: '/assets/logojumpin.png',
  },
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Popup />
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
