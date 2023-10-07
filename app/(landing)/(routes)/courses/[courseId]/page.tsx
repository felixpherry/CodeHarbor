import { db } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    courseId: string;
  };
}

const Page = async ({ params: { courseId } }: PageProps) => {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      category: {
        select: {
          ageDescription: true,
        },
      },
      program: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          sessions: {
            where: {
              isPublished: true,
            },
          },
        },
      },
      classes: {
        select: {
          _count: {
            select: {
              students: true,
            },
          },
        },
      },
    },
  });

  if (!course) return notFound();
  const {
    id,
    image,
    name,
    level,
    category,
    description,
    programId,
    programmingTools,
  } = course;

  console.log({ course });
  return (
    <div>
      <div className='bg-gradient-to-l from-[#273575] to-[#004AAD]'>
        <div className='relative container max-w-7xl text-center py-24'>
          <div className='flex flex-col items-center gap-y-2'>
            <h1 className='font-josefin font-bold text-3xl md:text-4xl lg:text-5xl text-white animate-appearance-in'>
              {name}
            </h1>
            <ul className='flex justify-center items-center gap-3 text-white font-semibold'>
              <li>
                <Link href='/courses' className='hover:text-primary-yellow'>
                  Courses
                </Link>
              </li>
              <li className='bg-white w-[6px] h-[6px] rounded-full'></li>
              <li>{name}</li>
            </ul>
          </div>
          <Image
            src='/rocket.png'
            height={130}
            width={130}
            alt='rocket'
            className='absolute z-10 bottom-1 left-2 animate-bounce running w-24 h-24 md:w-40 md:h-40'
          />
          <Image
            src='/planets.png'
            height={150}
            width={300}
            alt='planets'
            className='absolute z-10 bottom-8 right-2 animate-pulse h-[40px] w-[180px] md:h-[68px] md:w-[300px]'
          />
        </div>
      </div>
      <div className='container max-w-7xl my-28'></div>
    </div>
  );
};

export default Page;
