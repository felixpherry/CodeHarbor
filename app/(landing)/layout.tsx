import Navbar from '@/app/(landing)/_components/Navbar';
import Footer from '@/app/(landing)/_components/Footer';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
