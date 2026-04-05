import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Integral Arena',
  description: 'A daily integration challenge platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="container">
            <Navigation />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
