'use client';

import ActionTooltip from '@/components/shared/ActionTooltip';
import { cn } from '@/lib/utils';
import { SessionInterface } from '@/types';
import {
  BookCheck,
  CalendarDays,
  LucideIcon,
  MessageCircle,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ClassDetailTabsProps {
  classId: string;
  session: SessionInterface;
}

interface ClassTab {
  label: string;
  href: string;
  icon: LucideIcon;
}

const ClassDetailTabs = ({ classId, session }: ClassDetailTabsProps) => {
  const studentTabs: ClassTab[] = [
    {
      label: 'Sessions',
      href: `/student/my-classes/${classId}/sessions`,
      icon: CalendarDays,
    },
    {
      label: 'Chat',
      href: `/student/my-classes/${classId}/chat`,
      icon: MessageCircle,
    },
    {
      label: 'Members',
      href: `/student/my-classes/${classId}/members`,
      icon: Users,
    },
    {
      label: 'Leaderboard',
      href: `/student/my-classes/${classId}/leaderboard`,
      icon: Trophy,
    },
  ];

  const instructorTabs: ClassTab[] = [
    {
      label: 'Sessions',
      href: `/instructor/my-classes/${classId}/sessions`,
      icon: CalendarDays,
    },
    {
      label: 'Chat',
      href: `/instructor/my-classes/${classId}/chat`,
      icon: MessageCircle,
    },
    {
      label: 'Assessment',
      href: `/instructor/my-classes/${classId}/assessment`,
      icon: BookCheck,
    },
    {
      label: 'Members',
      href: `/instructor/my-classes/${classId}/members`,
      icon: Users,
    },
    {
      label: 'Leaderboard',
      href: `/instructor/my-classes/${classId}/leaderboard`,
      icon: Trophy,
    },
  ];

  const tabs =
    session.user.role === 'INSTRUCTOR' ? instructorTabs : studentTabs;

  const pathname = usePathname()!;

  if (!session) return null;
  return (
    <div className='flex items-center'>
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'p-3 flex items-center justify-center text-sm flex-1',
            pathname.includes(href)
              ? 'bg-primary-blue text-white'
              : 'bg-secondary text-muted-foreground'
          )}
        >
          <span className='hidden md:block'>{label}</span>
          <ActionTooltip label={label}>
            <Icon className='block md:hidden h-4 w-4' />
          </ActionTooltip>
        </Link>
      ))}
    </div>
  );
};

export default ClassDetailTabs;
