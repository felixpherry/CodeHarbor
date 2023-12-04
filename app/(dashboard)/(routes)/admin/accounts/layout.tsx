interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-[#F7F9FD] p-5'>
      <div className='container max-w-7xl px-0'>{children}</div>
    </div>
  );
};

export default Layout;
