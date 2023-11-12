'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input, Text } from '@mantine/core';
import { useState } from 'react';
import {
  MappedClass,
  useCreateClassStore,
} from '../../_stores/use-create-class-store';
import {
  ChevronDown,
  Loader2,
  PencilIcon,
  SaveAll,
  Trash2,
  Undo2,
} from 'lucide-react';
import { cn, convertToTitleCase } from '@/lib/utils';
import MappedClassForm from './MappedClassForm';
import { modals } from '@mantine/modals';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createClassesForNextPeriod } from '@/lib/actions/class.actions';
import Pagination from '@/components/shared/Pagination';
import { getNextPeriod } from '@/lib/actions/period.actions';
import { ConfirmModal } from '@/components/modals/ConfirmModal';

const MappedClassesTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const mappedClasses = useCreateClassStore((state) => state.mappedClasses);
  const setMappedClasses = useCreateClassStore(
    (state) => state.setMappedClasses
  );

  const filteredMappedClasses = mappedClasses.filter(({ id, name }) => {
    return name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
  });

  const currMappedClasses = filteredMappedClasses.slice(
    (page - 1) * 10,
    (page - 1) * 10 + 10
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    setMappedClasses(
      mappedClasses.filter((mappedClass) => mappedClass.id !== id)
    );
  };

  const handleShowDetail = (mappedClass: MappedClass) => {
    modals.open({
      title: <h1 className='text-primary text-lg font-bold'>Edit Class</h1>,
      children: (
        <MappedClassForm type='EDIT' initialMappedClass={mappedClass} />
      ),
      size: 'xl',
    });
  };

  const courses = useCreateClassStore((state) => state.courses);
  const getCourse = (id: string) => {
    return courses.find((course) => course.id === id);
  };

  const instructorSchedules = useCreateClassStore(
    (state) => state.instructorSchedules
  );
  const getInstructorSchedule = (id: string) => {
    return instructorSchedules.find(
      (instructorSchedule) => instructorSchedule.id === id
    );
  };

  const getFormattedSchedule = (id: string) => {
    const instructorSchedule = getInstructorSchedule(id);
    if (!instructorSchedule) return '';

    return `${convertToTitleCase(instructorSchedule.day.day)}, ${
      instructorSchedule.shift.startTime
    } - ${instructorSchedule.shift.endTime}`;
  };

  const [openedRows, setOpenedRows] = useState(new Set<string>());

  const handleToggle = (id: string) => {
    const cloneOpenedRows = new Set(openedRows);
    if (cloneOpenedRows.has(id)) cloneOpenedRows.delete(id);
    else cloneOpenedRows.add(id);
    setOpenedRows(cloneOpenedRows);
  };

  const studentCourses = useCreateClassStore((state) => state.studentCourses);
  const getStudentCourse = (id: string) => {
    return studentCourses.find((studentCourse) => studentCourse.id === id);
  };

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await createClassesForNextPeriod({ mappedClasses });
      const nextPeriod = await getNextPeriod();
      setMappedClasses([]);
      toast.success('Successfully saved classes');
      router.push(`/admin/classes?period=${nextPeriod?.id}`);
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (!mappedClasses.length) return;

    setMappedClasses([]);
  };

  const headers = ['No.', 'Name', 'Course', 'Schedule', 'Actions', ''];

  return (
    <div className='flex flex-col gap-3 p-5 border rounded-md'>
      <div className='flex justify-between'>
        <Input
          placeholder='Search class...'
          value={search}
          onChange={handleSearch}
          className='md:w-1/3'
        />
        <div className='flex items-center gap-3'>
          <ConfirmModal
            title='Are you sure?'
            description='Do you want to reset the results?'
            variant={{ confirm: 'destructive' }}
            onConfirm={handleReset}
          >
            <Button
              disabled={!mappedClasses.length}
              variant='destructive'
              className='flex items-center'
              size='sm'
            >
              <Undo2 className='h-4 w-4' />
              Reset
            </Button>
          </ConfirmModal>
          <Button
            onClick={handleSave}
            disabled={!mappedClasses.length}
            className='flex items-center'
            size='sm'
          >
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <SaveAll className='h-4 w-4' />
            )}
            Save
          </Button>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead
                  key={header}
                  className='text-muted-foreground font-semibold text-base'
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currMappedClasses.map(
              (
                { id, name, courseId, instructorScheduleId, studentCourseIds },
                idx
              ) => (
                <>
                  <TableRow
                    key={id}
                    onClick={() => handleToggle(id)}
                    className='cursor-pointer'
                  >
                    <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                    <TableCell className='text-primary font-bold'>
                      {name}
                    </TableCell>
                    <TableCell className='text-muted-foreground font-semibold'>
                      {getCourse(courseId)?.name}
                    </TableCell>
                    <TableCell className='text-muted-foreground font-semibold'>
                      {getFormattedSchedule(instructorScheduleId)}
                    </TableCell>
                    <TableCell className='text-muted-foreground font-semibold'>
                      <div className='flex items-center gap-4'>
                        <PencilIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowDetail({
                              id,
                              name,
                              courseId,
                              instructorScheduleId,
                              studentCourseIds,
                            });
                          }}
                          className='h-5 w-5 cursor-pointer text-primary-blue'
                        />
                        <Trash2
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(id);
                          }}
                          className='h-5 w-5 cursor-pointer text-red-500'
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <ChevronDown
                        className={cn(
                          'transition-all duration-500',
                          openedRows.has(id) && 'rotate-180'
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    className={cn(
                      'hover:!bg-white',
                      !openedRows.has(id) && 'hidden'
                    )}
                  >
                    <TableCell colSpan={6}>
                      <div className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-3 p-5 border rounded-md'>
                          <h2 className='text-muted-foreground font-medium text-lg'>
                            Instructor
                          </h2>
                          <hr />
                          <div className='rounded-md border'>
                            <Table>
                              <TableHeader className='border-b'>
                                <TableRow>
                                  <TableHead className='text-primary'>
                                    Name
                                  </TableHead>
                                  <TableHead className='text-primary'>
                                    Schedule
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <div className='flex gap-5 items-center'>
                                      <Image
                                        src={
                                          getInstructorSchedule(
                                            instructorScheduleId
                                          )?.instructor.account.image ||
                                          '/avatar-fallback.svg'
                                        }
                                        alt={
                                          getInstructorSchedule(
                                            instructorScheduleId
                                          )?.instructor.account.name || ''
                                        }
                                        width={25}
                                        height={25}
                                        className='rounded-full'
                                      />
                                      <div className='flex flex-col'>
                                        <h3 className='text-primary text-sm font-semibold'>
                                          {
                                            getInstructorSchedule(
                                              instructorScheduleId
                                            )?.instructor.account.name
                                          }
                                        </h3>
                                        <p className='text-muted-foreground text-xs'>
                                          {
                                            getInstructorSchedule(
                                              instructorScheduleId
                                            )?.instructor.account.email
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {getFormattedSchedule(instructorScheduleId)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        <div className='flex flex-col gap-3 p-5 border rounded-md'>
                          <h2 className='text-primary font-medium text-lg'>
                            Students
                          </h2>
                          <hr />
                          <div className='rounded-md border'>
                            <Table>
                              <TableHeader className='border-b'>
                                <TableRow>
                                  <TableHead className='text-primary'>
                                    No.
                                  </TableHead>
                                  <TableHead className='text-primary'>
                                    Name
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {studentCourseIds.map((id, idx) => (
                                  <TableRow key={id} className='cursor-pointer'>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>
                                      <div className='flex gap-5 items-center'>
                                        <Image
                                          src={
                                            getStudentCourse(id)?.student
                                              .account.image ||
                                            '/avatar-fallback.svg'
                                          }
                                          alt={
                                            getStudentCourse(id)?.student
                                              .account.name || ''
                                          }
                                          width={25}
                                          height={25}
                                          className='rounded-full'
                                        />
                                        <div className='flex flex-col'>
                                          <h3 className='text-primary text-sm font-semibold'>
                                            {
                                              getStudentCourse(id)?.student
                                                .account.name
                                            }
                                          </h3>
                                          <p className='text-muted-foreground text-xs'>
                                            {
                                              getStudentCourse(id)?.student
                                                .account.email
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          {studentCourseIds.length === 0 && (
                            <p className='text-primary text-base font-semibold text-center'>
                              No Students
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              )
            )}
          </TableBody>
        </Table>
      </div>
      {filteredMappedClasses.length === 0 && (
        <p className='text-primary text-base font-semibold text-center'>
          No Classes
        </p>
      )}
      <Pagination
        getNextPage={() => setPage(page + 1)}
        getPrevPage={() => setPage(page - 1)}
        limit={10}
        withSearchParams={false}
        page={page}
        count={filteredMappedClasses.length}
      />
    </div>
  );
};

export default MappedClassesTable;
