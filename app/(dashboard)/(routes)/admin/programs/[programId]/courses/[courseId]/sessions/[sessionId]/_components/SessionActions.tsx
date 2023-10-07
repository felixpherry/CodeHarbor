'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import { deleteSession, updateSession } from '@/lib/actions/program.actions';
import { Session } from '@prisma/client';
import { Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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
  const router = useRouter();
  const pathname = usePathname();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteSession(session.id);
      toast.success('Successfully deleted session');
      router.refresh();
      router.push(`/admin/programs/${programId}/courses/${session.courseId}`);
    } catch (error: any) {
      toast.error(error.message);
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
            courseId: session.courseId,
            isPublished: false,
          },
        });
        toast.success('Successfully unpublish session');
      } else {
        await updateSession({
          id: session.id,
          pathname,
          payload: {
            isPublished: true,
          },
        });
        toast.success('Successfully publish session');
      }
    } catch (error: any) {
      toast.error(error.message);
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
