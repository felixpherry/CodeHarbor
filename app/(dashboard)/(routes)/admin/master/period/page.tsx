import { db } from '@/lib/db';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { generatePeriod } from '@/lib/actions/generate.actions';

const Page = async () => {
  //   await generatePeriod();
  const periods = await db.period.findMany({
    orderBy: {
      startDate: 'asc',
    },
  });

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={periods} />
    </div>
  );
};

export default Page;
