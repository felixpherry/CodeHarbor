'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const addNewPeriod = async ({
  payload,
  pathname,
}: {
  payload: Prisma.PeriodUncheckedCreateInput;
  pathname: string;
}) => {
  try {
    const period = await db.period.create({
      data: payload,
    });

    revalidatePath(pathname);

    return period;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to add period: ${error.message}`);
  }
};

export const updatePeriod = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Prisma.PeriodUncheckedUpdateInput;
  pathname: string;
}) => {
  try {
    const period = await db.period.update({
      where: { id },
      data: payload,
    });

    revalidatePath(pathname);

    return period;
  } catch (error: any) {
    throw new Error(`Failed to update period: ${error.message}`);
  }
};

export const deletePeriod = async ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) => {
  try {
    const period = await db.period.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return period;
  } catch (error: any) {
    throw new Error(`Failed to delete period: ${error.message}`);
  }
};
