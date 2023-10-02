import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import CreateClassForm from '../_components/CreateClassForm';
import { db } from '@/lib/db';
import moment from 'moment';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  const courses = await db.course.findMany({
    where: {
      program: {
        isPublished: true,
      },
      isPublished: true,
    },
  });
  const courseOptions = courses.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const periods = await db.period.findMany({
    where: {
      startDate: {
        gt: new Date(),
      },
    },
  });

  const periodOptions = periods.map(({ id, startDate, endDate }) => ({
    label: `${moment(startDate).format('MMM YYYY')} - ${moment(endDate).format(
      'MMM YYYY'
    )}`,
    value: id,
  }));

  return (
    <>
      <CreateClassForm
        session={session}
        courseOptions={courseOptions}
        periodOptions={periodOptions}
      />
    </>
  );
};

export default Page;
