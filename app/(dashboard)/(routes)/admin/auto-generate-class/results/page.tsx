import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const Page = () => {
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} />
    </div>
  );
};

export default Page;
