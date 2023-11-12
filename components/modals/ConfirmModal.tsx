'use client';

import { modals } from '@mantine/modals';
import { ButtonProps } from '../ui/button';
import { Button } from '../ui/button';

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => Promise<unknown> | void;
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
        <div className='flex flex-col gap-5'>
          <p>{description}</p>
          <div className='w-full flex justify-end gap-3'>
            <Button
              onClick={() => modals.closeAll()}
              variant={variant?.cancel || 'outline'}
              size='sm'
            >
              {label?.cancel || 'Cancel'}
            </Button>
            <Button
              onClick={async () => {
                await onConfirm();
                modals.closeAll();
              }}
              variant={variant?.confirm || 'default'}
              size='sm'
            >
              {label?.confirm || 'Confirm'}
            </Button>
          </div>
        </div>
      ),
    });
  };

  return <div onClick={openModal}>{children}</div>;
};
