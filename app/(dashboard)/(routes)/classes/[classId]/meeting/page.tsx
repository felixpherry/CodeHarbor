import MediaRoom from '@/components/MediaRoom';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: {
    classId: string;
  };
}

const page = async ({ params: { classId } }: Props) => {
  const session = (await getCurrentUser()) as SessionInterface;

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
  });

  if (!classData) return redirect('/not-found');
  return (
    <div className='bg-white flex flex-col h-full'>
      <MediaRoom
        session={session}
        classId={classData.id}
        video={true}
        audio={true}
      />
    </div>
  );
};

export default page;