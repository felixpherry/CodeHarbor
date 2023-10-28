import { fetchAccountDetail } from '@/lib/actions/account.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

const ParentLayout = async ({ children }: Props) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (session?.user.role !== 'PARENT') return redirect('/not-found');

  const userInfo = await fetchAccountDetail(session.user.id);

  if (userInfo?.onboarded) return redirect('/parent/dashboard');

  return <>{children}</>;
};

export default ParentLayout;
