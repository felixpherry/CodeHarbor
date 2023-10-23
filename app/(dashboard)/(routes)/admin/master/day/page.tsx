import { db } from '@/lib/db';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const Page = async () => {
  const days = await db.masterDay.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={days} />
    </div>
  );
};

export default Page;
