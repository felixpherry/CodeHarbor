import { fetchAccountDetail } from '@/lib/actions/account.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

const StudentLayout = async ({ children }: Props) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (session?.user.role !== 'STUDENT') return redirect('/not-found');

  const userInfo = await fetchAccountDetail(session.user.id);

  if (!userInfo?.onboarded) return redirect('/student/onboarding');

  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-5'>
      {children}
    </div>
  );
};

export default StudentLayout;
