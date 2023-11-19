import FilterSelect from '@/components/shared/FilterSelect';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getCurrentPeriod, getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { MantineSelectOption, SessionInterface } from '@/types';
import { CalendarDays, ChevronDown, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams?: {
    period: string;
  };
}

const page = async ({ searchParams }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  const student = await db.student.findUnique({
    where: {
      accountId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!student) return notFound();

  const currPeriod = await getCurrentPeriod();

  const classes = await db.class.findMany({
    where: {
      studentCourses: {
        some: {
          studentId: student.id,
        },
      },
      periodId: searchParams?.period || currPeriod?.id,
    },
    include: {
      course: true,
      period: true,
      schedules: true,
      instructorSchedule: {
        include: {
          instructor: {
            include: {
              account: true,
            },
          },
        },
      },
      _count: {
        select: {
          studentCourses: true,
        },
      },
    },
  });

  const pastPeriods = await db.period.findMany({
    where: {
      endDate: {
        lte: new Date(),
      },
    },
  });

  const nextPeriod = await getNextPeriod();

  const allPeriods = [...pastPeriods, currPeriod!, nextPeriod!];

  const periodOptions: MantineSelectOption[] = allPeriods.map(
    ({ id, name }) => ({
      label: name,
      value: id,
    })
  );

  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-2xl text-primary font-bold'>My Classes</h1>
      <div className='w-full md:w-1/2'>
        <FilterSelect
          options={periodOptions}
          withSearchParams={true}
          defaultValue={currPeriod?.id || ''}
          searchParamsKey='period'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {classes.map(
          ({ course, id, schedules, name, instructorSchedule, _count }) => (
            <Link
              key={id}
              href={`/student/my-classes/${id}/sessions/${schedules[0].id}`}
              className='group'
            >
              <Card className='shadow-lg hover:shadow-2xl' key={id}>
                <CardContent className='overflow-visible p-0 pb-5'>
                  <div className='relative'>
                    <div className='card-image_shadow absolute h-full w-full top-0 left-0 rounded-tr-lg z-20' />
                    <Image
                      width={480}
                      height={140}
                      alt={course.name}
                      className='w-full object-cover h-[160px] rounded-t-lg relative'
                      src={course.image || ''}
                    />
                  </div>
                  <div className='px-6 mt-4 flex flex-col gap-8'>
                    <h3 className='text-xl font-semibold hover:text-primary-blue'>
                      {course.name} - {name}
                    </h3>
                    <div className='max-h-0 hidden transition-all duration-500 group-hover:flex group-hover:justify-between hover:max-h-96'>
                      <div className='flex items-center gap-1'>
                        <CalendarDays className='w-4 h-4 text-primary-blue' />
                        <span className='text-muted-foreground text-sm'>
                          {schedules.length} sessions
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <GraduationCap className='h-4 w-4 text-primary-blue' />
                        <span className='text-muted-foreground text-sm'>
                          {_count.studentCourses} students
                        </span>
                      </div>
                    </div>
                    <div className='mx-auto'>
                      <ChevronDown className='h-4 w-4 text-muted-foreground transition-all duration-500 group-hover:rotate-180' />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className='flex flex-col w-full gap-3'>
                    <div className='h-3 bg-secondary rounded-full'>
                      <div className='h-full w-1/2 bg-primary-blue rounded-full'></div>
                    </div>
                    <div className='flex justify-between w-full'>
                      <div className='flex gap-1 items-center'>
                        <Image
                          src={
                            instructorSchedule?.instructor.account.image || ''
                          }
                          alt={
                            instructorSchedule?.instructor.account.name || ''
                          }
                          height={30}
                          width={30}
                          className='rounded-full h-8 w-8'
                        />
                        <p className='font-light'>
                          {instructorSchedule?.instructor.account.name}
                        </p>
                      </div>
                      <div className='flex flex-col items-end text-primary-blue'>
                        <span className='font-medium'>50%</span>
                        <span className='font-light'>Complete</span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          )
        )}
      </div>
      {classes.length === 0 && (
        <h3 className='text-primary font-semibold text-center text-lg'>
          No Class
        </h3>
      )}
    </div>
  );
};

export default page;
