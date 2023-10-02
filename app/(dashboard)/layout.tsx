import { getCurrentUser } from '@/lib/session';
import Navbar from './_components/Navbar';
import Sidebar from './_components/Sidebar';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';
import { fetchAccountDetail } from '@/lib/actions/account.actions';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  const accountDetail = await fetchAccountDetail(session?.user.id);

  if (!accountDetail?.onboarded) return redirect('/onboarding');

  return (
    <div className='h-full'>
      <div className='h-[80px] md:pl-56 fixed inset-y-0 w-full z-50'>
        <Navbar />
      </div>
      <div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
        <Sidebar />
      </div>
      <main className='md:pl-56 pt-[80px] h-full'>{children}</main>
    </div>
  );
};

export default DashboardLayout;
