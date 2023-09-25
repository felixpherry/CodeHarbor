import Navbar from '@/app/(landing)/_components/Navbar';
import Footer from '@/app/(landing)/_components/Footer';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout = async ({ children }: LandingLayoutProps) => {
  const session = (await getCurrentUser()) as SessionInterface;
  return (
    <>
      <Navbar session={session} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default LandingLayout;
