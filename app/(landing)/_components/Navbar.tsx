import Link from 'next/link';

import Image from 'next/image';
import { NavLinks } from '@/constants';
import { getCurrentUser } from '@/lib/session';
import ProfileMenu from '../../../components/shared/ProfileMenu';
import { SessionInterface } from '@/types';
import { Button } from '../../../components/ui/button';
import { LogIn, UserCircle2 } from 'lucide-react';

const Navbar = async () => {
  const session = (await getCurrentUser()) as SessionInterface;

  return (
    <nav className='flexBetween navbar'>
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
          <span className='self-center text-primary-blue text-2xl font-semibold font-fabada whitespace-nowrap hover:text-primary-blue-600'>
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

      <div className='flexCenter gap-4'>
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
