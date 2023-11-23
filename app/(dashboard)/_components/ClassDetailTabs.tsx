'use client';

import { cn } from '@/lib/utils';
import { SessionInterface } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ClassDetailTabsProps {
  classId: string;
  sessionId: string;
  session: SessionInterface;
}

const ClassDetailTabs = ({
  classId,
  sessionId,
  session,
}: ClassDetailTabsProps) => {
  const pathname = usePathname();

  const isMembersRouteActive = pathname.endsWith('/members');
  const isLeaderboardRouteActive = pathname.endsWith('/leaderboard');

  if (!session) return null;
  return (
    <div className='grid grid-cols-3'>
      <Link
        href={`/${session.user.role.toLocaleLowerCase()}/my-classes/${classId}/sessions/${sessionId}`}
        className={cn(
          'p-3 text-center text-sm',
          !isMembersRouteActive && !isLeaderboardRouteActive
            ? 'bg-primary-blue text-white'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        Sessions
      </Link>
      <Link
        href={`/${session.user.role.toLocaleLowerCase()}/my-classes/${classId}/members`}
        className={cn(
          'p-3 bg-primary-blue text-white text-center text-sm',
          isMembersRouteActive
            ? 'bg-primary-blue text-white'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        Members
      </Link>
      <Link
        href={`/${session.user.role.toLocaleLowerCase()}/my-classes/${classId}/leaderboard`}
        className={cn(
          'p-3 bg-primary-blue text-white text-center text-sm',
          isLeaderboardRouteActive
            ? 'bg-primary-blue text-white'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        Leaderboard
      </Link>
    </div>
  );
};

export default ClassDetailTabs;
