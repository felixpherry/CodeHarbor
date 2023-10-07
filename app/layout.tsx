import './globals.css';
import '@smastrom/react-rating/style.css';
import localFont from 'next/font/local';
import { Poppins, Josefin_Sans } from 'next/font/google';

import UIProvider from '@/providers/UIProvider';
import { cn } from '@/lib/utils';
import ToasterProvider from '@/providers/ToasterProvider';

const fabada = localFont({
  src: '../fonts/Fabada-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-fabada',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-josefin',
});

export const metadata = {
  title: 'Lecturna',
  description:
    'Lecturna offers a coding course specifically designed to assist children in acquiring the skills necessary for creating websites, developing mobile apps, and engaging in game development.',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang='en'
      className={cn(fabada.variable, poppins.variable, josefin.variable)}
    >
      <body>
        <UIProvider>{children}</UIProvider>
        <ToasterProvider />
      </body>
    </html>
  );
};

export default RootLayout;
