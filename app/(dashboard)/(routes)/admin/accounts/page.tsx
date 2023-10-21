import { db } from '@/lib/db';
import { RegistrationStatus, Role, Status } from '@prisma/client';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

interface PageProps {
  searchParams: {
    role?: string;
    status?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const statuses = ['ACTIVE', 'BANNED'];
  const roles = ['PARENT', 'STUDENT', 'INSTRUCTOR', 'ADMIN'];

  const data = await db.account.findMany({
    where: {
      role: roles.includes(searchParams.role?.toLocaleUpperCase() || '')
        ? (searchParams.role?.toLocaleUpperCase() as Role)
        : undefined,
      status: statuses.includes(searchParams.status?.toLocaleUpperCase() || '')
        ? (searchParams.status?.toLocaleUpperCase() as Status)
        : undefined,
    },
  });

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Page;
