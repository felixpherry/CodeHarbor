import About from '@/app/(landing)/_components/About';
import Programs from '@/app/(landing)/_components/Programs';
import Testimonials from '@/app/(landing)/_components/Testimonials';
import WhatsAppWidget from '@/app/(landing)/_components/WhatsAppWidget';
import Faq from '@/components/layouts/Faq';
import Hero from '@/components/layouts/Hero';
import { fetchFaq } from '@/lib/actions/faq.actions';
import { fetchHero } from '@/lib/actions/hero.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';

export default async function Home({
  searchParams: { category },
}: {
  searchParams: { category?: string };
}) {
  const session = (await getCurrentUser()) as SessionInterface;
  const hero = await fetchHero();

  const faq = await fetchFaq();

  return (
    <div className='bg-light-white'>
      <Hero
        session={session}
        title={hero?.title || ''}
        subtitle={hero?.subtitle || ''}
        image={hero?.image || ''}
      />
      <About />
      <Programs category={category} />
      <Testimonials />
      <Faq type='view' session={session} faq={faq} />
      <WhatsAppWidget />
    </div>
  );
}
