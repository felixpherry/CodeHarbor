'use client';

const Footer = () => {
  return (
    <div className='flex justify-between bg-secondary p-5'>
      &copy; {new Date().getFullYear()} Code Harbor
    </div>
  );
};

export default Footer;
