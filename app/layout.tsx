import './globals.css';
import '@smastrom/react-rating/style.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import localFont from 'next/font/local';
import { Poppins, Josefin_Sans } from 'next/font/google';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { cn } from '@/lib/utils';
import ToasterProvider from '@/providers/ToasterProvider';
import { Metadata } from 'next';

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

export const metadata: Metadata = {
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
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
        <ToasterProvider />
      </body>
    </html>
  );
};

export default RootLayout;
