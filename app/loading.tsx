import { Loader2 } from 'lucide-react';
import React from 'react';

const Loading = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <Loader2 className='mr-2 w-8 h-8 animate-spin' />
    </div>
  );
};

export default Loading;
