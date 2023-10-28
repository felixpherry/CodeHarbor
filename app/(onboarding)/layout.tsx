import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  return <>{children}</>;
};

export default DashboardLayout;
