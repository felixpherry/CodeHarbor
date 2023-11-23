import ClassLeaderboardFallback from '@/app/(dashboard)/_components/class-leaderboard/ClassLeaderboardFallback';
import ClassLeaderboardPage from '@/app/(dashboard)/_components/class-leaderboard/ClassLeaderboardPage';
import { Suspense } from 'react';

interface PageProps {
  params: {
    classId: string;
  };
}

const Page = async ({ params: { classId } }: PageProps) => {
  return (
    <Suspense fallback={<ClassLeaderboardFallback />}>
      <ClassLeaderboardPage classId={classId} />
    </Suspense>
  );
};

export default Page;
