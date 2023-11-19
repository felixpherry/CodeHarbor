import { ScrollArea } from '@mantine/core';

import Logo from './Logo';
import SidebarRoutes from './SidebarRoutes';
import { SessionInterface } from '@/types';

const Sidebar = ({ session }: { session: SessionInterface }) => {
  return (
    <nav className='bg-white p-4 pt-0 flex flex-col border-r shadow-sm h-full w-full'>
      <div className='p-4 border-b shadow-sm -mx-4 h-20'>
        <div className='flex justify-between items-center'>
          <div className='flex gap-2 items-center'>
            <Logo />
            <div className='font-fabada text-primary-blue text-xl font-semibold'>
              Lecturna
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className='flex-1 -mx-4 no-scrollbar'>
        <SidebarRoutes session={session} />
      </ScrollArea>
    </nav>
  );
};

export default Sidebar;
