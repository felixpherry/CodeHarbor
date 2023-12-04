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
    <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-5'>
      <div className='container max-w-7xl px-0'>
        <div className='container mx-auto p-0'>
          <div className='flex flex-col gap-5'>
            <h1 className='text-muted-foreground font-bold text-lg'>
              Programs
            </h1>
            <DataTable columns={columns} data={programs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
