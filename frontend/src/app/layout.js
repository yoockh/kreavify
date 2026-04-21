import './globals.css';
import { I18nProvider } from '@/lib/i18n';

export const metadata = {
  title: 'Kreavify — Invoice & Pembayaran untuk Kreator Indonesia',
  description: 'Platform invoice & pembayaran digital untuk freelancer kreatif Indonesia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
