import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Tarih Muhabiri - Birincil Kaynaklarla Tarih Öğretimi',
  description: 'Tarih dersleri için birincil belgelere dayalı röportaj, 1919 dönemi gazete sayfası ve iki sesli podcast oluşturan eğitim uygulaması.',
  openGraph: {
    title: 'Tarih Muhabiri - Birincil Kaynaklarla Tarih Öğretimi',
    description: 'Tarih dersleri için birincil belgelere dayalı röportaj, 1919 dönemi gazete sayfası ve iki sesli podcast oluşturan eğitim uygulaması.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarih Muhabiri - Birincil Kaynaklarla Tarih Öğretimi',
    description: 'Tarih dersleri için birincil belgelere dayalı röportaj, 1919 dönemi gazete sayfası ve iki sesli podcast oluşturan eğitim uygulaması.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
