import ClassMembersFallback from '@/app/(dashboard)/_components/class-members/ClassMembersFallback';
import ClassMembersPage from '@/app/(dashboard)/_components/class-members/ClassMembersPage';
import { Suspense } from 'react';

interface PageProps {
  params: {
    classId: string;
  };
}

const Page = async ({ params: { classId } }: PageProps) => {
  return (
    <Suspense fallback={<ClassMembersFallback />}>
      <ClassMembersPage classId={classId} />
    </Suspense>
  );
};

export default Page;
