import { getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

interface PageProps {
  searchParams: {
    course?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const nextPeriod = await getNextPeriod();
  const data = await db.studentCourse.findMany({
    where: {
      status: 'APPROVED',
      classId: null,
      courseId: searchParams.course,
      periodId: nextPeriod?.id,
    },
    include: {
      course: true,
      student: {
        include: {
          account: true,
        },
      },
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
      <DataTable data={data} columns={columns} courseOptions={courseOptions} />
    </div>
  );
};

export default Page;
