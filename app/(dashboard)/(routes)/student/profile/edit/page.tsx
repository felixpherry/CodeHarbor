import { getCurrentUser } from '@/lib/session';
import ProfileSettings from './_components/ProfileSettings';
import { AccountWithStudent, SessionInterface } from '@/types';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface | null;

  const account = await db.account.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      student: true,
    },
  });

  if (!session || !account || !account.student) return notFound();

  return (
    <div className='flex flex-col gap-8 min-h-[calc(100vh-80px)]'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl text-primary font-bold'>Profile Settings</h1>
        <div className='flex items-center gap-2'>
          <Link
            href='/student/profile'
            className='text-xs font-normal text-primary'
          >
            Profile
          </Link>
          <ChevronRight className='h-3 w-3 text-muted-foreground' />
          <p className='text-xs font-nomal text-muted-foreground'>Settings</p>
        </div>
      </div>
      <ProfileSettings account={account as AccountWithStudent} />
    </div>
  );
};

export default Page;
