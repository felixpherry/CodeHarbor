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
    <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-5'>
      <div className='container max-w-7xl px-0'>
        <div className='container mx-auto p-0'>
          <div className='flex flex-col gap-5'>
            <h1 className='text-muted-foreground font-bold text-lg'>
              Categories
            </h1>
            <DataTable columns={columns} data={categories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
