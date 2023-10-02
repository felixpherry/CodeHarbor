'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { deleteSession, updateSession } from '@/lib/actions/program.actions';
import { Session } from '@prisma/client';
import { Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface SessionActionsProps {
  session: Session;
  disabled: boolean;
  programId: string;
}

const SessionActions = ({
  disabled,
  session,
  programId,
}: SessionActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteSession(session.id);
      toast({
        description: 'Successfully deleted session',
        variant: 'success',
      });
      router.refresh();
      router.push(
        `/admin/programs/${programId}/subprograms/${session.subprogramId}`
      );
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

      if (session.isPublished) {
        await updateSession({
          id: session.id,
          pathname,
          payload: {
            subprogramId: session.subprogramId,
            isPublished: false,
          },
        });
        toast({
          description: 'Successfully unpublish session',
          variant: 'success',
        });
      } else {
        await updateSession({
          id: session.id,
          pathname,
          payload: {
            isPublished: true,
          },
        });
        toast({
          description: 'Successfully publish session',
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
        {session.isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size='sm' disabled={isLoading}>
          <Trash className='h-4 w-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default SessionActions;
