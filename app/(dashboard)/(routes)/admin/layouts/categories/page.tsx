import { db } from '@/lib/db';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const Page = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <DataTable
      columns={columns}
      data={categories}
    />
  );
};

export default Page;
