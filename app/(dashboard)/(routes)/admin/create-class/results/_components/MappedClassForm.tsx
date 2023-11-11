'use client';

import {
  MappedClass,
  useCreateClassStore,
} from '../../_stores/use-create-class-store';
import { Button } from '@/components/ui/button';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import SelectedStudentsTable from './SelectedStudentsTable';
import AvailableStudentsTable from './AvailableStudentsTable';
import AvailableInstructorsTable from './AvailableInstructorsTable';
import { toast } from 'sonner';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, Select } from '@mantine/core';
import { MantineSelectOption } from '@/types';
import SelectedInstructorTable from './SelectedInstructorTable';
import { getClassesForNextPeriod } from '@/lib/actions/class.actions';

interface MappedClassFormProps {
  initialMappedClass?: MappedClass;
  type: 'ADD' | 'EDIT';
}

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(6, {
    message: 'Name should be at least 6 characters',
  }),
  courseId: z.string().min(1, {
    message: 'Course is required',
  }),
  studentCourseIds: z.string().array().min(1, {
    message: 'Class should have at least 1 student',
  }),
  instructorScheduleId: z.string().min(1, {
    message: 'Instructor is required',
  }),
});

const MappedClassForm = ({
  initialMappedClass,
  type,
}: MappedClassFormProps) => {
  const mappedClasses = useCreateClassStore((state) => state.mappedClasses);
  const setMappedClasses = useCreateClassStore(
    (state) => state.setMappedClasses
  );

  const studentCourses = useCreateClassStore((state) => state.studentCourses);

  const instructorSchedules = useCreateClassStore(
    (state) => state.instructorSchedules
  );

  const [isEditingInstructor, setIsEditingInstructor] = useState(false);

  const courses = useCreateClassStore((state) => state.courses);

  const courseOptions: MantineSelectOption[] = courses.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialMappedClass?.id || nanoid(),
      name: initialMappedClass?.name || '',
      courseId: initialMappedClass?.courseId || '',
      instructorScheduleId: initialMappedClass?.instructorScheduleId || '',
      studentCourseIds: initialMappedClass?.studentCourseIds || [],
    },
  });

  const studentsWithoutClasses = studentCourses
    .filter(
      ({ id, courseId }) =>
        !mappedClasses.find(
          ({ studentCourseIds, id: mappedClassId }) =>
            studentCourseIds.some(
              (studentCourseId) => studentCourseId === id
            ) && initialMappedClass?.id !== mappedClassId
        ) &&
        !form
          .watch('studentCourseIds')
          .find((studentCourseId) => studentCourseId === id) &&
        courseId === form.watch('courseId')
    )
    .map(({ id }) => id);

  const instructorsWithoutClasses = instructorSchedules
    .filter(
      ({ id, instructor: { instructorCourses } }) =>
        !mappedClasses.find(
          ({ instructorScheduleId, id: mappedClassId }) =>
            instructorScheduleId === id &&
            mappedClassId !== initialMappedClass?.id
        ) &&
        id !== form.watch('instructorScheduleId') &&
        instructorCourses.some(
          ({ courseId }) => courseId === form.watch('courseId')
        )
    )
    .map(({ id }) => id);

  const handleDeleteStudents = (selected: Set<string>) => {
    form.setValue(
      'studentCourseIds',
      form.getValues('studentCourseIds').filter((id) => !selected.has(id))
    );
  };

  const handleAddStudents = (selected: Set<string>) => {
    form.setValue('studentCourseIds', [
      ...form.getValues('studentCourseIds'),
      ...Array.from(selected),
    ]);
  };

  const handleSelectInstructor = (id: string) => {
    const currInstructorScheduleId = form.getValues('instructorScheduleId');

    form.setValue('instructorScheduleId', id);

    setIsEditingInstructor(false);
  };

  const handleSelectCourse = (
    courseId: string,
    fieldChange: (courseId: string) => void
  ) => {
    form.setValue('studentCourseIds', []);
    form.setValue('instructorScheduleId', '');
    fieldChange(courseId);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const classes = await getClassesForNextPeriod();
      if (
        classes.find(({ name }) => name === values.name) ||
        mappedClasses.find(
          ({ name, id }) => name === values.name && id !== form.getValues('id')
        )
      ) {
        toast.error('Class name must be unique');
        return form.setError('name', {
          message: 'Name is already taken',
        });
      }

      if (type === 'EDIT') {
        setMappedClasses(
          mappedClasses.map((mappedClass) => {
            if (mappedClass.id === initialMappedClass?.id) return { ...values };
            return mappedClass;
          })
        );
        toast.success('Successfully updated class');
      } else {
        setMappedClasses([{ ...values }, ...mappedClasses]);
        toast.success('Successfully added class');
      }
      modals.closeAll();
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-5'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='COL001' {...field} />
              </FormControl>
              <FormDescription>Class name must be unique</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='courseId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <FormControl>
                <Select
                  placeholder='Choose course'
                  checkIconPosition='right'
                  data={courseOptions}
                  maxDropdownHeight={200}
                  searchable
                  clearable
                  value={field.value}
                  onChange={(value) =>
                    handleSelectCourse(value || '', field.onChange)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch('courseId') && (
          <>
            <FormField
              control={form.control}
              name='instructorScheduleId'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {isEditingInstructor || !field.value ? (
                      <AvailableInstructorsTable
                        instructorScheduleIds={instructorsWithoutClasses}
                        handleSelectInstructor={handleSelectInstructor}
                        setIsEditingInstructor={setIsEditingInstructor}
                      />
                    ) : (
                      <SelectedInstructorTable
                        instructorScheduleId={field.value}
                        setIsEditingInstructor={setIsEditingInstructor}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='studentCourseIds'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <SelectedStudentsTable
                        studentCourseIds={field.value}
                        handleDeleteStudents={handleDeleteStudents}
                      />
                      <AvailableStudentsTable
                        studentCourseIds={studentsWithoutClasses}
                        handleAddStudents={handleAddStudents}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className='flex w-full items-center gap-3 justify-end border-t pt-4'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => modals.closeAll()}
          >
            Close
          </Button>
          <Button type='submit' size='sm'>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MappedClassForm;
