import RegistrationTabs from './_components/RegistrationTabs';
import { db } from '@/lib/db';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const trialClassCount = await db.trialClassRegistration.count({
    where: {
      status: 'PENDING',
    },
  });

  const courseRegistrationCount = await db.courseRegistration.count({
    where: {
      status: 'PENDING',
    },
  });

  const instructorRegistrationCount = await db.instructorRegistration.count({
    where: {
      status: 'PENDING',
    },
  });

  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-8'>
      <div className='container max-w-7xl px-0'>
        <RegistrationTabs
          courseRegistrationCount={courseRegistrationCount}
          instructorRegistrationCount={instructorRegistrationCount}
          trialClassCount={trialClassCount}
        />
        <div className='bg-white rounded-b-lg shadow-sm'>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
