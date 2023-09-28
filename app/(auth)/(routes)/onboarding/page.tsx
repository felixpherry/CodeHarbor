// import AccountProfile from '@/components/forms/AccountProfile';
import { fetchAccountDetail } from '@/lib/actions/account.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';
import AccountProfile from '../../_components/AccountProfile';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  if (!session) return null;

  const accountDetail = await fetchAccountDetail(session.user.id);

  if (accountDetail?.onboarded)
    return redirect(`/${accountDetail.role.toLocaleLowerCase()}/dashboard`);

  const accountData = {
    id: accountDetail?.id || '',
    name: accountDetail?.name || '',
    username: accountDetail?.username || '',
    email: accountDetail?.email || '',
    password: '',
    phoneNumber: accountDetail?.phoneNumber || '',
    image: accountDetail?.image || '',
    address: accountDetail?.address || '',
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='text-3xl font-bold text-slate-700'>Onboarding</h1>
      <p className='mt-3 text-base font-normal text-slate-500'>
        Complete your profile now to use Lecturna
      </p>

      <section className='mt-9 bg-light-white p-10'>
        <AccountProfile account={accountData} session={session} />
      </section>
    </main>
  );
};

export default Page;
