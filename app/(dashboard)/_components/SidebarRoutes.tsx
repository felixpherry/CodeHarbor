'use client';

import { IconTableOptions } from '@tabler/icons-react';
import SidebarItem from './SidebarItem';
import { Code2, Layout, ScrollText, Users, Users2, Wrench } from 'lucide-react';

const adminRoutes = [
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
    label: 'Customization',
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

const SidebarRoutes = () => {
  const routes = adminRoutes;
  return (
    <div className='py-8'>
      {routes.map((item) => (
        <SidebarItem {...item} key={item.label} />
      ))}
    </div>
  );
};

export default SidebarRoutes;
