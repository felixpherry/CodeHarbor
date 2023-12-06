import { db } from '@/lib/db';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const Page = async () => {
  const faq = await db.faq.findMany({
    orderBy: {
      question: 'asc',
    },
  });

  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-5'>
      <div className='container max-w-7xl px-0'>
        <div className='container mx-auto p-0'>
          <div className='flex flex-col gap-5'>
            <h1 className='text-muted-foreground font-bold text-lg'>
              Frequently Asked Questions
            </h1>
            <DataTable columns={columns} data={faq} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
