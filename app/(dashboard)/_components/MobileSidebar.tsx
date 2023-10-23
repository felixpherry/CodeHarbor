import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
// import Sidebar from './Sidebartemp';

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden py-2 px-4 rounded-lg hover:bg-accent hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white w-72'>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
