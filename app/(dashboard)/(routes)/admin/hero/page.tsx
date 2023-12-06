import { fetchHero } from '@/lib/actions/hero.actions';
import HeroForm from './_components/HeroForm';

const Page = async () => {
  const hero = await fetchHero();
  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-5'>
      <div className='container max-w-7xl px-0'>
        <div className='container mx-auto p-0'>
          <div className='flex flex-col gap-5'>
            <h1 className='text-muted-foreground font-bold text-lg'>Hero</h1>

            <div className='p-5 shadow rounded-md bg-white'>
              <div className='flex flex-col gap-5'>
                <div className='pb-[15px] border-b'>
                  <h3 className='text-muted-foreground font-bold text-base'>
                    Customize Hero
                  </h3>
                </div>
                <HeroForm initialData={hero} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
