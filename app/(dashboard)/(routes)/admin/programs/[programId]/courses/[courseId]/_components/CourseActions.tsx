'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { deleteCourse, updateCourse } from '@/lib/actions/program.actions';
import { Course } from '@prisma/client';
import { Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface CourseActionsProps {
  course: Course;
  disabled: boolean;
}

const CourseActions = ({ disabled, course }: CourseActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteCourse(course.id);
      toast({
        description: 'Successfully deleted course',
        variant: 'success',
      });
      router.refresh();
      router.push(`/admin/programs/${course.programId}`);
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

      if (course.isPublished) {
        await updateCourse({
          id: course.id,
          pathname,
          payload: {
            programId: course.programId,
            isPublished: false,
          },
        });
        toast({
          description: 'Successfully unpublish course',
          variant: 'success',
        });
      } else {
        await updateCourse({
          id: course.id,
          pathname,
          payload: {
            isPublished: true,
          },
        });
        toast({
          description: 'Successfully publish course',
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
        {course.isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size='sm' disabled={isLoading}>
          <Trash className='h-4 w-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default CourseActions;
