import { Metadata } from 'next'

// La confirmación de compra es personal (lleva el QR del ticket): fuera de Google.
export const metadata: Metadata = {
  title: 'Compra confirmada',
  robots: { index: false, follow: false },
}

export default function ShopSuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
