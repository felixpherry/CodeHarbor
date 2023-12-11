import { db } from '@/lib/db';
import InstructorOnboardingStepper from './_components/InstructorOnboardingStepper';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { Account, Instructor } from '@prisma/client';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  const data = (await db.account.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      instructor: {
        include: {
          skills: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })) as {
    instructor: {
      skills: {
        id: string;
      }[];
    } & Instructor;
  } & Account;

  const skills = await db.skill.findMany();

  const days = await db.masterDay.findMany({
    where: {
      isActive: true,
    },
  });

  const shifts = await db.masterShift.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      isDeleted: false,
      program: {
        isPublished: true,
        isDeleted: false,
      },
    },
  });

  return (
    <div className='flex flex-col gap-3'>
      <InstructorOnboardingStepper
        data={data}
        skills={skills}
        days={days}
        shifts={shifts}
        courses={courses}
      />
    </div>
  );
};

export default Page;
