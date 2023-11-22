import { db } from '@/lib/db';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    classId: string;
  };
}

const Page = async ({ params: { classId } }: PageProps) => {
  const classData = await db.class.findUnique({
    where: {
      id: classId,
    },
    include: {
      instructorSchedule: {
        include: {
          instructor: {
            include: {
              account: true,
            },
          },
        },
      },
      studentCourses: {
        include: {
          student: {
            include: {
              account: true,
            },
          },
        },
      },
    },
  });

  if (!classData) return notFound();

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-xl font-semibold'>Instructor</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          <div className='p-8 rounded-md bg-white shadow'>
            <div className='flex items-center justify-center'>
              <div className='flex flex-col gap-1 items-center'>
                <Image
                  src={
                    classData.instructorSchedule?.instructor.account.image || ''
                  }
                  height={75}
                  width={75}
                  alt={
                    classData.instructorSchedule?.instructor.account.name || ''
                  }
                  className='h-24 w-fit rounded-full mb-4'
                />
                <h3 className='text-primary text-lg font-bold'>
                  {classData.instructorSchedule?.instructor.account.name}
                </h3>
                <p className='text-muted-foreground text-base'>
                  {classData.instructorSchedule?.instructor.account.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h3 className='text-xl font-semibold'>Students</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {classData.studentCourses.map(({ id, student }) => (
            <div key={id} className='p-8 rounded-md bg-white shadow'>
              <div className='flex items-center justify-center'>
                <div className='flex flex-col gap-1 items-center'>
                  <Image
                    src={student.account.image || ''}
                    height={75}
                    width={75}
                    alt={student.account.name}
                    className='h-24 w-fit rounded-full mb-4'
                  />
                  <h3 className='text-primary text-lg font-bold'>
                    {student.account.name}
                  </h3>
                  <p className='text-primary text-base'>{student.studentId}</p>
                  <p className='text-muted-foreground text-base'>
                    {student.account.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
