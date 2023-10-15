import { db } from '@/lib/db';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { RegistrationStatus } from '@prisma/client';
import { generateCourseRegistrationData } from '@/lib/actions/generate.actions';

interface PageProps {
  searchParams: {
    status?: string;
    course?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  // await generateCourseRegistrationData();
  const statuses = ['APPROVED', 'PENDING', 'REJECTED'];

  const data = await db.courseRegistration.findMany({
    where: {
      status: statuses.includes(searchParams.status?.toLocaleUpperCase() || '')
        ? (searchParams.status?.toLocaleUpperCase() as RegistrationStatus)
        : 'PENDING',
      courseId: searchParams.course,
    },
    include: {
      course: {
        select: {
          name: true,
        },
      },
      coupon: {
        select: {
          code: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      program: {
        isPublished: true,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const courseOptions = courses.map(({ id, name }) => ({
    text: name,
    value: id,
  }));

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} courseOptions={courseOptions} />
    </div>
  );
};

export default Page;
