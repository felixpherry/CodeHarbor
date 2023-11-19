'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ClassDetailTabsProps {
  classId: string;
  sessionId: string;
}

const ClassDetailTabs = ({ classId, sessionId }: ClassDetailTabsProps) => {
  const pathname = usePathname();

  const isMembersRouteActive = pathname.endsWith('/members');
  return (
    <div className='grid grid-cols-2'>
      <Link
        href={`/student/my-classes/${classId}/sessions/${sessionId}`}
        className={cn(
          'p-3 text-center text-sm',
          !isMembersRouteActive
            ? 'bg-primary-blue text-white'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        Sessions
      </Link>
      <Link
        href={`/student/my-classes/${classId}/members`}
        className={cn(
          'p-3 bg-primary-blue text-white text-center text-sm',
          isMembersRouteActive
            ? 'bg-primary-blue text-white'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        Members
      </Link>
    </div>
  );
};

export default ClassDetailTabs;
