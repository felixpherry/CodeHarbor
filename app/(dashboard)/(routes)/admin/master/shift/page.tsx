import { db } from '@/lib/db';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const Page = async () => {
  const shifts = await db.masterShift.findMany({
    orderBy: {
      startTime: 'asc',
    },
  });

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={shifts} />
    </div>
  );
};

export default Page;
