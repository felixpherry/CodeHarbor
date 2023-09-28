import LogoForm from '@/app/(dashboard)/_components/LogoForm';
import { fetchLogo } from '@/lib/actions/logo.actions';

const Page = async () => {
  const logo = await fetchLogo();
  return (
    <div className='w-full px-4 py-20 md:px-10 min-h-[calc(100vh-80px)]'>
      <h1 className='mb-12 text-4xl text-center font-bold tracking-tight leading-none'>
        Logo
      </h1>
      <LogoForm id={logo?.id || ''} image={logo?.image || ''} />
    </div>
  );
};

export default Page;
