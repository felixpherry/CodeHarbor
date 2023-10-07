import Preview from '@/components/shared/Preview';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { Course, Session } from '@prisma/client';
import { CalendarDays, Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  course: {
    sessions: Session[];
    category: {
      ageDescription: string;
    } | null;
  } & Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { id, image, name, sessions, category, description, level } = course;

  const badgeColor = {
    BEGINNER: 'bg-emerald-500',
    INTERMEDIATE: 'bg-sky-500',
    ADVANCED: 'bg-red-600',
  };

  return (
    <>
      <Card className='shadow' key={id}>
        <CardContent className='overflow-visible p-0'>
          <div className='relative'>
            <Image
              width={480}
              height={140}
              alt={name}
              className='w-full object-cover h-[240px] shadow rounded-lg'
              src={image || ''}
            />
            <span
              className={cn(
                'absolute p-3 top-3 text-xs right-3 text-white font-semibold rounded-lg',
                badgeColor[level ?? 'BEGINNER']
              )}
            >
              {level}
            </span>
          </div>
          <div className='px-4 mt-4'>
            <h3 className='text-2xl font-semibold'>{name}</h3>
            <div className='flex flex-start items-center gap-1 text-sm text-muted-foreground mt-2'>
              <div className='flex items-center gap-1'>
                <CalendarDays className='w-4 h-4 text-primary-blue' />
                <span>{sessions.length} sessions</span>
              </div>
              <div className='flex items-center gap-1'>
                <Dot className='w-5 h-5 text-primary-blue' />
                <span>{category?.ageDescription}</span>
              </div>
            </div>
          </div>
          <span className='text-sm text-muted-foreground mt-1'>
            <Preview value={description || ''} className='[&_p]:line-clamp-3' />
          </span>
        </CardContent>
        <CardFooter className='text-sm justify-between gap-2 pb-5 px-3'>
          <Button
            variant='primary-blue'
            size='sm'
            asChild
            className='w-1/2 text-sm'
          >
            <Link href={`/courses/${id}/register`}>Enroll</Link>
          </Button>
          <Button
            variant='primary-blue-outline'
            size='sm'
            asChild
            className='w-1/2 text-sm'
          >
            <Link href={`/courses/${id}`}>Course Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CourseCard;
