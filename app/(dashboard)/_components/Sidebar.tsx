import { ScrollArea } from '@/components/ui/scroll-area';
import Logo from './Logo';
import SidebarRoutes from './SidebarRoutes';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm'>
      <div className='p-6 mx-auto'>
        <Link href='/'>
          <Logo />
        </Link>
      </div>

      <div className='relative overflow-hidden flex flex-col w-full'>
        <ScrollArea className='h-full w-full rounded-inherit'>
          <SidebarRoutes />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;
