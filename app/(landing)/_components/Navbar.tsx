'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NavLinks } from '@/constants';
import ProfileMenu from '../../../components/shared/ProfileMenu';
import { SessionInterface } from '@/types';
import { Button } from '../../../components/ui/button';
import { LogIn, UserCircle2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  session: SessionInterface;
}

const Navbar = ({ session }: NavbarProps) => {
  const [active, setActive] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  return (
    <nav
      className={cn(
        'flexBetween navbar',
        active && 'fixed top-0 left-0 z-[80] shadow-xl transition duration-500'
      )}
    >
      <div className='flex-1 flexStart gap-10'>
        <Link href='/' className='flex items-center'>
          <Image
            className='mr-3'
            src='/logo.png'
            width={75}
            height={75}
            alt='Lecturna'
            priority={true}
          />
          <span className='hidden md:block self-center text-primary-blue text-2xl font-semibold font-fabada whitespace-nowrap hover:text-primary-blue-600'>
            Lecturna
          </span>
        </Link>
        <ul className='md:flex hidden text-small gap-7'>
          {NavLinks.map((link) => (
            <Link href={link.href} key={link.key}>
              {link.text}
            </Link>
          ))}
        </ul>
      </div>

      <div className='flexCenter gap-4 ml-auto'>
        {session?.user ? (
          <ProfileMenu session={session} />
        ) : (
          <>
            <Button variant='primary-blue-outline' asChild>
              <Link
                href='login'
                className='hidden md:inline-flex !rounded-full text-sm font-semibold'
              >
                <UserCircle2 />
                Masuk
              </Link>
            </Button>
            <Link href='/login' className='block md:hidden text-primary-blue'>
              <LogIn />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
