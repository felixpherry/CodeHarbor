'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  deleteSubprogram,
  updateSubprogram,
} from '@/lib/actions/program.actions';
import { Subprogram } from '@prisma/client';
import { Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface SubprogramActionsProps {
  subprogram: Subprogram;
  disabled: boolean;
}

const SubprogramActions = ({
  disabled,
  subprogram,
}: SubprogramActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteSubprogram(subprogram.id);
      toast({
        description: 'Successfully deleted subprogram',
        variant: 'success',
      });
      router.refresh();
      router.push(`/admin/programs/${subprogram.programId}`);
    } catch (error: any) {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (subprogram.isPublished) {
        await updateSubprogram({
          id: subprogram.id,
          pathname,
          payload: {
            programId: subprogram.programId,
            isPublished: false,
          },
        });
        toast({
          description: 'Successfully unpublish subprogram',
          variant: 'success',
        });
      } else {
        await updateSubprogram({
          id: subprogram.id,
          pathname,
          payload: {
            isPublished: true,
          },
        });
        toast({
          description: 'Successfully publish subprogram',
          variant: 'success',
        });
      }
    } catch (error: any) {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant='outline'
        size='sm'
      >
        {subprogram.isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size='sm' disabled={isLoading}>
          <Trash className='h-4 w-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default SubprogramActions;
