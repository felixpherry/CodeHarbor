'use client';

import { IconFileDescription, IconTableOptions } from '@tabler/icons-react';
import SidebarItem, { SidebarItemProps } from './SidebarItem';
import {
  Code2,
  GraduationCap,
  Layout,
  ScrollText,
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
        label: 'Evaluation',
        href: '/admin/master/evaluation',
      },
      {
        label: 'Grade',
        href: '/admin/master/grade',
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
    label: 'Layout',
    icon: IconTableOptions,
    initiallyOpened: false,
    links: [
      {
        label: 'Hero',
        href: '/admin/hero',
      },
      {
        label: 'FAQ',
        href: '/admin/faq',
      },
      {
        label: 'Categories',
        href: '/admin/categories',
      },
      {
        label: 'Logo',
        href: '/admin/logo',
      },
    ],
  },
];

const studentRoutes: SidebarItemProps[] = [
  { label: 'Dashboard', icon: Layout, href: '/student/dashboard' },
  { label: 'My Classes', icon: GraduationCap, href: '/student/my-classes' },
  { label: 'Grades', icon: IconFileDescription, href: '/student/grades' },
];

const SidebarRoutes = ({ session }: { session: SessionInterface }) => {
  let routes: SidebarItemProps[] = [];
  if (session.user.role === 'ADMIN') {
    routes = adminRoutes;
  } else if (session.user.role === 'STUDENT') {
    routes = studentRoutes;
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
