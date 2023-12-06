import { fetchLogo } from '@/lib/actions/logo.actions';
import LogoForm from './_components/LogoForm';

const Page = async () => {
  const logo = await fetchLogo();
  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-5'>
      <div className='container max-w-7xl px-0'>
        <div className='container mx-auto p-0'>
          <div className='flex flex-col gap-5'>
            <h1 className='text-muted-foreground font-bold text-lg'>Logo</h1>
            <div className='p-5 shadow rounded-md bg-white'>
              <div className='flex flex-col gap-5'>
                <div className='pb-[15px] border-b'>
                  <h3 className='text-muted-foreground font-bold text-base'>
                    Customize Logo
                  </h3>
                </div>
                <LogoForm initialData={logo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
