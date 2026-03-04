import './globals.css';

export const metadata = {
  title: 'KaryaKita — Invoice & Pembayaran untuk Kreator Indonesia',
  description: 'Platform invoice & pembayaran digital untuk freelancer kreatif Indonesia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
