'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const registerInstructor = async ({
  payload,
  pathname,
}: {
  payload: {
    data: Prisma.InstructorRegistrationCreateInput;
    skills: string[];
  };
  pathname: string;
}) => {
  try {
    const result = await db.instructorRegistration.create({
      data: {
        ...payload.data,
        skills: {
          connect: payload.skills.map((id) => ({ id })),
        },
      },
    });

    revalidatePath(pathname);
    return result;
  } catch (error: any) {
    throw new Error(`Failed to register instructor: ${error.message}`);
  }
};
