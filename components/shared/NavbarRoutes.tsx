import { getCurrentUser } from '@/lib/session';
import ProfileMenu from './ProfileMenu';
import { SessionInterface } from '@/types';

const NavbarRoutes = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  return (
    <div className='flex-gap-x-2 ml-auto'>
      <ProfileMenu session={session} />{' '}
    </div>
  );
};

export default NavbarRoutes;
