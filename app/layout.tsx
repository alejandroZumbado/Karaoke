import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: '🎤 Karaoke – Letras con Estilo',
  description: '70 canciones con letras animadas y efectos visuales espectaculares',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body
        className="min-h-full"
        style={{ background: 'linear-gradient(135deg, #0a0010 0%, #0d0020 40%, #100015 100%)' }}
      >
        {children}
      </body>
    </html>
  );
}
