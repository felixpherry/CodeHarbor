'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  deleteProgram,
  deleteSubprogram,
  updateProgram,
  updateSubprogram,
} from '@/lib/actions/program.actions';
import { Program } from '@prisma/client';
import { Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProgramActionsProps {
  program: Program;
  disabled: boolean;
}

const ProgramActions = ({ disabled, program }: ProgramActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProgram(program.id);
      toast({
        description: 'Successfully deleted program',
        variant: 'success',
      });
      router.refresh();
      router.push(`/admin/programs`);
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

      if (program.isPublished) {
        await updateProgram({
          id: program.id,
          pathname,
          payload: {
            isPublished: false,
          },
        });
        toast({
          description: 'Successfully unpublish program',
          variant: 'success',
        });
      } else {
        await updateProgram({
          id: program.id,
          pathname,
          payload: {
            isPublished: true,
          },
        });
        toast({
          description: 'Successfully publish program',
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
        {program.isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size='sm' disabled={isLoading}>
          <Trash className='h-4 w-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ProgramActions;
