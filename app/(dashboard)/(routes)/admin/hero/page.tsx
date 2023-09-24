import Hero from '@/components/layouts/Hero';
import { fetchHero } from '@/lib/actions/hero.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  const hero = await fetchHero();
  return (
    <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
      <Hero
        type='edit'
        session={session}
        id={hero?.id || ''}
        title={hero?.title || ''}
        subtitle={hero?.subtitle || ''}
        image={hero?.image || ''}
      />
    </div>
  );
};

export default Page;
