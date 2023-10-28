import { fetchAccountDetail } from '@/lib/actions/account.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

const InstructorLayout = async ({ children }: Props) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (session?.user.role !== 'INSTRUCTOR') return redirect('/not-found');

  const userInfo = await fetchAccountDetail(session.user.id);

  if (!userInfo?.onboarded) return redirect('/instructor/onboarding');

  return <>{children}</>;
};

export default InstructorLayout;
