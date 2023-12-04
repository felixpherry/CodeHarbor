'use client';

import { modals } from '@mantine/modals';
import { ButtonProps, Button } from '../ui/button';
import ConfirmForm from './ConfirmForm';

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: (...args: any[]) => Promise<unknown> | void;
  title: string;
  description: string;
  label?: {
    confirm?: string;
    cancel?: string;
  };
  variant?: {
    confirm?: ButtonProps['variant'];
    cancel?: ButtonProps['variant'];
  };
}

export const ConfirmModal = ({
  children,
  onConfirm,
  title,
  description,
  label,
  variant,
}: ConfirmModalProps) => {
  const openModal = () => {
    modals.open({
      title: <p className='text-primary font-semibold'>{title}</p>,
      children: (
        <ConfirmForm
          description={description}
          onConfirm={onConfirm}
          label={label}
          variant={variant}
        />
      ),
    });
  };

  return <button onClick={openModal}>{children}</button>;
};
