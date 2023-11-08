import { getCurrentPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

interface ClassPageParams {
  searchParams: {
    period?: string;
    course?: string;
  };
}

const Page = async ({ searchParams }: ClassPageParams) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session || session.user.role !== 'ADMIN') return redirect('/');

  const currentPeriod = await getCurrentPeriod();

  const classes = await db.class.findMany({
    include: {
      _count: {
        select: {
          studentCourses: true,
        },
      },
      course: true,
      period: true,
    },
    orderBy: {
      name: 'asc',
    },
    where: {
      periodId: searchParams.period || currentPeriod?.id || undefined,
      courseId: searchParams.course,
    },
  });

  const periods = await db.period.findMany();
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      program: {
        isPublished: true,
      },
    },
  });

  const courseOptions = courses.map(({ id, name }) => ({
    text: name,
    value: id,
  }));

  const periodOptions = periods.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <div className='p-6'>
      <DataTable
        columns={columns}
        data={classes}
        courseOptions={courseOptions}
        periodOptions={periodOptions}
        currentPeriodId={currentPeriod?.id || ''}
      />
    </div>
  );
};

export default Page;
