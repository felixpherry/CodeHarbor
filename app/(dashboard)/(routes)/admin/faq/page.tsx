import FaqForm from '@/app/(dashboard)/_components/FaqForm';
import { fetchFaq } from '@/lib/actions/faq.actions';

const Page = async () => {
  const faq = await fetchFaq();
  return <FaqForm faq={faq} />;
};

export default Page;
