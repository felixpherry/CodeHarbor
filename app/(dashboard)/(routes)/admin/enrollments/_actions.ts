'use server';

import { db } from '@/lib/db';
import { RegistrationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

interface UpdateEnrollmentStatusParams {
  studentCourseId: string;
  status: RegistrationStatus;
  pathname: string;
}

export const updateEnrollmentStatus = async ({
  pathname,
  status,
  studentCourseId,
}: UpdateEnrollmentStatusParams) => {
  try {
    const enrollment = await db.studentCourse.update({
      where: {
        id: studentCourseId,
      },
      data: {
        status,
      },
    });

    revalidatePath(pathname);
    return enrollment;
  } catch (error: any) {
    console.log('updateEnrollmentStatus', error.message);
    throw new Error(error.message);
  }
};
