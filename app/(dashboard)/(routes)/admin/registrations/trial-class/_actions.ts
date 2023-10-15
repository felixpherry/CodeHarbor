'use server';

import { db } from '@/lib/db';
import { RegistrationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const updateTrialClassRegistrationStatus = async ({
  id,
  status,
  pathname,
}: {
  id: string;
  status: RegistrationStatus;
  pathname: string;
}) => {
  try {
    const data = await db.trialClassRegistration.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    revalidatePath(pathname);
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to update registration status: ${error.message}`);
  }
};

export const fetchTrialClassDetail = async (id: string) => {
  try {
    return await db.trialClassRegistration.findUnique({
      where: { id },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch trial class detail: ${error.message}`);
  }
};
