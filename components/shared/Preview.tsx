'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.bubble.css';

interface PreviewProps {
  value: string;
  className?: string;
}

const Preview = ({ value, className = '' }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );
  return (
    <ReactQuill theme='bubble' className={className} value={value} readOnly />
  );
};

export default Preview;
