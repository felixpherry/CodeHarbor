'use client';

import { IconTableOptions } from '@tabler/icons-react';
import SidebarItem, { SidebarItemProps } from './SidebarItem';
import {
  BookCheck,
  CalendarDays,
  Code2,
  GraduationCap,
  Layout,
  ScrollText,
  User,
  UserPlus,
  Users,
  Users2,
  Wrench,
} from 'lucide-react';
import { SessionInterface } from '@/types';

const adminRoutes: SidebarItemProps[] = [
  { label: 'Dashboard', icon: Layout, href: '/admin/dashboard' },
  { label: 'Accounts', icon: Users, href: '/admin/accounts' },
  {
    label: 'Master',
    icon: Wrench,
    initiallyOpened: false,
    links: [
      {
        label: 'Day',
        href: '/admin/master/day',
      },
      {
        label: 'Period',
        href: '/admin/master/period',
      },
      {
        label: 'Shift',
        href: '/admin/master/shift',
      },
      {
        label: 'Grade',
        href: '/admin/master/grade',
      },
      {
        label: 'Skill',
        href: '/admin/master/skill',
      },
      {
        label: 'Coupon',
        href: '/admin/master/coupon',
      },
    ],
  },
  {
    label: 'Registrations',
    icon: ScrollText,
    href: '/admin/registrations/trial-class',
  },
  {
    label: 'Programs',
    icon: Code2,
    href: '/admin/programs',
  },
  {
    label: 'Classes',
    icon: Users2,
    href: '/admin/classes',
  },
  {
    label: 'Create Classes',
    icon: UserPlus,
    href: '/admin/create-class/students',
  },
  {
    label: 'Layouts',
    icon: IconTableOptions,
    href: '/admin/layouts/hero',
  },
];

const studentRoutes: SidebarItemProps[] = [
  { label: 'Dashboard', icon: Layout, href: '/student/dashboard' },
  { label: 'My Classes', icon: GraduationCap, href: '/student/my-classes' },
  { label: 'Schedule', icon: CalendarDays, href: '/student/schedule' },
  { label: 'Profile', icon: User, href: '/student/profile' },
];

const instructorRoutes: SidebarItemProps[] = [
  { label: 'Dashboard', icon: Layout, href: '/instructor/dashboard' },
  { label: 'My Classes', icon: GraduationCap, href: '/instructor/my-classes' },
  { label: 'Schedule', icon: CalendarDays, href: '/instructor/schedule' },
  { label: 'Profile', icon: User, href: '/instructor/profile' },
];

const SidebarRoutes = ({ session }: { session: SessionInterface }) => {
  let routes: SidebarItemProps[] = [];
  if (session.user.role === 'ADMIN') {
    routes = adminRoutes;
  } else if (session.user.role === 'STUDENT') {
    routes = studentRoutes;
  } else if (session.user.role === 'INSTRUCTOR') {
    routes = instructorRoutes;
  }

  return (
    <div className='py-8'>
      {routes.map((item) => (
        <SidebarItem {...item} key={item.label} />
      ))}
    </div>
  );
};

export default SidebarRoutes;
