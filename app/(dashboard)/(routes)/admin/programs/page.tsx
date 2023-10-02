import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';
import { fetchPrograms } from '@/lib/actions/program.actions';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session || session.user.role !== 'ADMIN') return redirect('/');

  const programs = await fetchPrograms();
  return (
    <div className='p-6'>
      <DataTable columns={columns} data={programs} />
    </div>
  );
};

export default Page;
