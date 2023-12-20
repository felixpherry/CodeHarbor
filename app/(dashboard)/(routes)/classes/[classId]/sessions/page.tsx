import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { notFound, redirect } from 'next/navigation';

interface PageParams {
  params: { classId: string };
}

const Page = async ({ params: { classId } }: PageParams) => {
  const session = (await getCurrentUser()) as SessionInterface;
  if (!session || session.user.role !== 'INSTRUCTOR') return notFound();

  const classData = await db.class.findUnique({
    where: {
      id: classId,
      OR: [
        {
          instructorSchedule: {
            instructor: {
              accountId: session.user.id,
            },
          },
        },
        {
          studentCourses: {
            some: {
              student: {
                accountId: session.user.id,
              },
            },
          },
        },
      ],
    },
    include: {
      schedules: {
        orderBy: {
          scheduleDate: 'asc',
        },
      },
    },
  });

  if (!classData) return redirect('/classes');

  const currSchedule =
    classData?.schedules.find(
      ({ scheduleDate }) =>
        new Date(scheduleDate).getTime() > new Date().getTime()
    ) || classData?.schedules.slice().pop();

  if (!currSchedule) return notFound();
  return redirect(`/classes/${classId}/sessions/${currSchedule.id}`);
};

export default Page;
