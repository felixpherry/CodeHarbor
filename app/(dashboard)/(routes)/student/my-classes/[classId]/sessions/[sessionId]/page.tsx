import ClassSessionFallback from '@/app/(dashboard)/_components/class-sessions/ClassSessionFallback';
import ClassSessionPage from '@/app/(dashboard)/_components/class-sessions/ClassSessionPage';

import { Suspense } from 'react';

interface PageProps {
  params: {
    classId: string;
    sessionId: string;
  };
}

const Page = async ({ params: { classId, sessionId } }: PageProps) => {
  return (
    <Suspense fallback={<ClassSessionFallback />}>
      <ClassSessionPage classId={classId} sessionId={sessionId} />
    </Suspense>
  );
};

export default Page;
