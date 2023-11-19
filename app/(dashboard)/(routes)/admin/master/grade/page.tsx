import { db } from '@/lib/db';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const Page = async () => {
  const grades = await db.masterGrade.findMany({
    orderBy: {
      minScore: 'asc',
    },
  });

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={grades} />
    </div>
  );
};

export default Page;
