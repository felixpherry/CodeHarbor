import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import CreateClassForm from '../_components/CreateClassForm';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  return (
    <>
      <CreateClassForm session={session} />
    </>
  );
};

export default Page;
