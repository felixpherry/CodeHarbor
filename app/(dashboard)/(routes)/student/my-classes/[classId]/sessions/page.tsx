import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';

interface PageParams {
  params: { classId: string };
}

const Page = async ({ params: { classId } }: PageParams) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session || session.user.role !== 'STUDENT') return redirect('/login');

  const classData = await db.class.findUnique({
    where: {
      id: classId,
      studentCourses: {
        some: {
          student: {
            accountId: session.user.id,
          },
        },
      },
    },
    include: {
      schedules: true,
    },
  });

  if (!classData) return redirect('/student/my-classes');
  return redirect(
    `/student/my-classes/${classId}/sessions/${classData.schedules[0].id}`
  );
};

export default Page;
