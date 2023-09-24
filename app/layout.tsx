import './globals.css';
import '@smastrom/react-rating/style.css';
import { Toaster } from '@/components/ui/toaster';
import localFont from 'next/font/local';

import UIProvider from '@/providers/UIProvider';
import { getCurrentUser } from '@/lib/session';

const fabada = localFont({
  src: '../fonts/Fabada-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-fabada',
});

export const metadata = {
  title: 'Lecturna',
  description:
    'Lecturna offers a coding course specifically designed to assist children in acquiring the skills necessary for creating websites, developing mobile apps, and engaging in game development.',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en' className={fabada.variable}>
      <body>
        <UIProvider>
          {children}
          <Toaster />
        </UIProvider>
      </body>
    </html>
  );
};

export default RootLayout;
