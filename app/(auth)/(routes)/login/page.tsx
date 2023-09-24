// import UserAuthForm from '@/components/forms/UserAuthForm';
import UserAuthForm from '@/components/forms/UserAuthForm';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/session';
import { ChevronLeft } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const LoginPage = async () => {
  const user = await getCurrentUser();

  if (user) redirect('/');
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <Link href='/' className='absolute left-4 top-4 md:left-8 md:top-8'>
        <Button variant='ghost'>
          <ChevronLeft className='h-4 w-4 mr-2' /> Kembali
        </Button>
      </Link>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <Image
            src='/logo.png'
            height={75}
            width={75}
            alt='logo'
            className='mx-auto'
          />
          <h1 className='text-2xl font-semibold tracking-tight'>
            Selamat datang di Lecturna
          </h1>
          <p className='text-sm text-gray-100'>
            Masuk ke akun menggunakan email
          </p>
        </div>
        <UserAuthForm />
        <p className='text-right text-sm text-gray-100'>
          <Link
            href='/forgot-password'
            className='hover:text-brand underline underline-offset-4'
          >
            Lupa password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
