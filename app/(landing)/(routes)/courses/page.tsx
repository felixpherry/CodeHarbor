import { db } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import CourseCard from './_components/CourseCard';
import CoursesFilter from './_components/CoursesFilter';
import CoursesPagination from './_components/CoursesPagination';
import { Level } from '@prisma/client';

interface CoursePageProps {
  searchParams: {
    search?: string;
    category?: string;
    level?: string;
    program?: string;
    page?: string;
  };
}

const Page = async ({ searchParams }: CoursePageProps) => {
  console.log({ searchParams });
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      program: {
        isPublished: true,
      },
      name: {
        contains: searchParams.search,
      },
      level: searchParams.level?.toLocaleUpperCase() as Level | undefined,
      categoryId: searchParams.category,
      programId: searchParams.program,
    },
    include: {
      sessions: {
        where: {
          isPublished: true,
        },
      },
      category: {
        select: {
          ageDescription: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
    take: 24,
    skip: ((Number(searchParams.page) || 1) - 1) * 24,
  });

  const count = await db.course.count({
    where: {
      isPublished: true,
      program: {
        isPublished: true,
      },
      name: {
        contains: searchParams.search,
      },
      level: searchParams.level?.toLocaleUpperCase() as Level | undefined,
      categoryId: searchParams.category,
      programId: searchParams.program,
    },
  });
  console.log({ count });

  const hasNextPage = (Number(searchParams.page) || 1) * 24 < count;

  return (
    <div>
      <div className='bg-gradient-to-l from-[#273575] to-[#004AAD]'>
        <div className='relative container max-w-7xl text-center py-24'>
          <div className='flex flex-col items-center gap-y-2'>
            <h1 className='font-josefin font-bold text-3xl md:text-4xl lg:text-5xl text-white animate-appearance-in'>
              Courses
            </h1>
            <ul className='flex justify-center items-center gap-3 text-white font-semibold'>
              <li>
                <Link href='/' className='hover:text-primary-yellow'>
                  Home
                </Link>
              </li>
              <li className='bg-white w-[6px] h-[6px] rounded-full'></li>
              <li>Courses</li>
            </ul>
          </div>
          <Image
            src='/rocket.png'
            height={130}
            width={130}
            alt='rocket'
            className='absolute z-10 bottom-1 left-2 animate-bounce running w-24 h-24 md:w-40 md:h-40'
          />
        </div>
      </div>
      <div className='container max-w-7xl my-28'>
        <h3 className='text-4xl font-semibold'>Course Catalogue</h3>
        <p className='text-lg mt-1 text-slate-700'>Explore our courses</p>
        <CoursesFilter />
        {!courses.length && (
          <p className='font-semibold text-xl text-center'>Courses not found</p>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <CoursesPagination hasNextPage={hasNextPage} />
      </div>
    </div>
  );
};

export default Page;
