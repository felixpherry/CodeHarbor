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
      instructorSchedule: {
        instructor: {
          accountId: session.user.id,
        },
      },
    },
    include: {
      schedules: true,
    },
  });

  if (!classData) return redirect('/instructor/my-classes');
  return redirect(
    `/instructor/my-classes/${classId}/sessions/${classData.schedules[0].id}`
  );
};

export default Page;
