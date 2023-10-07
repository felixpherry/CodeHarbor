import CourseLevelSelect from './CourseLevelSelect';
import CourseCategorySelect from './CourseCategorySelect';
import CourseSearchBox from './CourseSearchBox';
import { db } from '@/lib/db';
import CourseProgramBadges from './CourseProgramBadges';

const CoursesFilter = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      ageDescription: 'asc',
    },
  });

  const programs = await db.program.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className='my-10'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        <CourseSearchBox />
        <CourseLevelSelect />
        <CourseCategorySelect categories={categories} />
      </div>
      <CourseProgramBadges programs={programs} />
    </div>
  );
};

export default CoursesFilter;
