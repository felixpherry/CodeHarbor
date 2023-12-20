import { getCurrentUser } from '@/lib/session';
import Navbar from './_components/Navbar';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';
import Sidebar from './_components/Sidebar';
import { SocketProvider } from '@/providers/SocketProvider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  return (
    <SocketProvider>
      <div className='h-full'>
        <div className='h-[80px] md:pl-64 fixed inset-y-0 w-full z-50'>
          <Navbar />
        </div>
        <div className='hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50'>
          <Sidebar session={session} />
        </div>
        <main className='md:pl-64 pt-[80px] h-full'>
          <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-5'>
            {children}
          </div>
        </main>
      </div>
    </SocketProvider>
  );
};

export default DashboardLayout;
