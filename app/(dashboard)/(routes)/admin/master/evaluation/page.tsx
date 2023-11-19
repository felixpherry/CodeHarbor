import { db } from '@/lib/db';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const Page = async () => {
  const evaluations = await db.masterEvaluation.findMany();

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={evaluations} />
    </div>
  );
};

export default Page;
