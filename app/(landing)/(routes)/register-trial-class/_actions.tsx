'use server';

import { db } from '@/lib/db';
import { Prisma, TrialClassRegistration } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const registerTrialClass = async ({
  payload,
  pathname,
}: {
  payload: Prisma.TrialClassRegistrationUncheckedCreateInput;
  pathname: string;
}) => {
  try {
    const result = await db.trialClassRegistration.create({
      data: {
        ...payload,
      },
    });

    revalidatePath(pathname);
    return result;
  } catch (error: any) {
    throw new Error(`Pendaftaran trial class gagal: ${error.message}`);
  }
};
