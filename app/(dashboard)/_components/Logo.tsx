import { fetchLogo } from '@/lib/actions/logo.actions';
import Image from 'next/image';

const Logo = async () => {
  const logo = await fetchLogo();
  return (
    <Image src={logo?.image || '/logo.png'} height={90} width={90} alt='logo' />
  );
};

export default Logo;
