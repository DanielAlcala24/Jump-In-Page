import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SonnerToaster } from '@/components/sonner-toaster';
import Popup from '@/components/popup';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jumpin.com.mx'),
  title: {
    default: 'Jump-In | Parque de Trampolines y Trampoline Park en México',
    template: '%s | Jump-In'
  },
  description: 'Jump-In: El mejor parque de trampolines y trampoline park en México. Diversión familiar, fiestas de cumpleaños y el mejor entretenimiento.',
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/assets/LogoFavicon.png?v=2', type: 'image/png' }
    ],
    apple: { url: '/assets/LogoFavicon.png?v=2', sizes: '180x180' },
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

        {/* Google Tag Manager - Script principal */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PFWMMNBZ');`}
        </Script>


        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-7VFM1S3HZN" strategy="afterInteractive" />
        <Script id="google-analytics-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7VFM1S3HZN');
            gtag('config', 'AW-16651738395');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "lxqed18ama");
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PFWMMNBZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {children}
        <Popup />
        <Toaster />
        <SonnerToaster />

        {/* HubSpot Embed Code */}
        <Script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="//js.hs-scripts.com/48545315.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
