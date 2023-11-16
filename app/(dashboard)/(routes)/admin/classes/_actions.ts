'use server';

import { getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { ClassTableInterface } from './_components/columns';
import { revalidatePath } from 'next/cache';

export const getAvailableInstructors = async (
  courseId: string,
  classId: string
) => {
  try {
    const nextPeriod = await getNextPeriod();
    if (!nextPeriod) return [];
    return await db.instructorSchedule.findMany({
      include: {
        day: true,
        shift: true,
        instructor: {
          include: {
            account: true,
          },
        },
      },
      where: {
        OR: [{ class: null }, { class: { id: classId } }],
        periodId: nextPeriod?.id,
        instructor: {
          instructorCourses: {
            some: {
              courseId,
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch available instructors for the next period: ${error.message}`
    );
  }
};

export const getAvailableStudents = async (
  courseId: string,
  classId: string
) => {
  try {
    const nextPeriod = await getNextPeriod();
    if (!nextPeriod) return [];
    return await db.studentCourse.findMany({
      include: {
        student: {
          include: {
            account: true,
          },
        },
      },
      where: {
        OR: [{ class: null }, { class: { id: classId } }],
        courseId,
      },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch available students for the next period: ${error.message}`
    );
  }
};

export const updateClass = async (
  data: ClassTableInterface,
  pathname: string
) => {
  try {
    const newClass = await db.class.update({
      where: {
        id: data.id,
      },
      data: {
        instructorSchedule: {
          connect: {
            id: data.instructorScheduleId!,
          },
        },
        studentCourses: {
          set: data.studentCourses.map(({ id }) => ({ id })),
        },
        schedules: {
          deleteMany: {},
          createMany: {
            data: data.schedules.map(
              ({
                meetingUrl,
                recordingUrl,
                sessionNumber,
                scheduleDate,
                scheduleTime,
              }) => ({
                meetingUrl,
                recordingUrl,
                sessionNumber,
                scheduleDate,
                scheduleTime,
              })
            ),
          },
        },
      },
    });

    revalidatePath(pathname);
    return newClass;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to update class: ${error.message}`);
  }
};

export const deleteClass = async (id: string, pathname: string) => {
  try {
    const res = await db.class.delete({
      where: { id },
    });

    revalidatePath(pathname);
    return res;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to delete class: ${error.message}`);
  }
};
