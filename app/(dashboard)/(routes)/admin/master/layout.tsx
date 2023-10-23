interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-8'>
      <div className='container max-w-7xl px-0'>
        <div className='bg-white rounded-b-lg shadow-sm'>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
