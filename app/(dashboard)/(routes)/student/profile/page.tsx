import { Button } from '@/components/ui/button';
import { fetchAccountDetail } from '@/lib/actions/account.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { CalendarDays } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  const accountDetail = await fetchAccountDetail(session.user.id);

  return (
    <div className='flex flex-col p-8'>
      <div className='flex justify-between items-start'>
        <div className='flex items-center gap-5'>
          <Image
            src={session.user.image}
            alt='Profile Photo'
            width={128}
            height={128}
            className='rounded-full h-32 w-32'
          />
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-1'>
              <h3 className='font-bold text-2xl'>{accountDetail?.name}</h3>
              <p className='text-base'>@{accountDetail?.username}</p>
            </div>
            <div className='flex items-center gap-2'>
              <CalendarDays className='h-4 w-4' />
              Joined {moment(accountDetail?.createdAt).format('MMMM YYYY')}
            </div>
          </div>
        </div>
        <Button variant='outline' className='shadow-sm'>
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default Page;
