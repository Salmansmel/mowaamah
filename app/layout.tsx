import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

const cairo = Cairo({
  variable: '--font-cairo-google',
  subsets: ['arabic', 'latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter-google',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'مواءمة | Mowaama',
  description:
    'المنصة الآلية الأولى للامتثال التنظيمي في المملكة العربية السعودية للشركات الناشئة.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-cairo">
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
