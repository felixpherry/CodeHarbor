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
    console.log('addNewPeriod', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Period name must be unique');
      }
    }
    throw new Error('Internal Server Error');
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
    console.log('updatePeriod', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Period name must be unique');
      }
    }
    throw new Error('Internal Server Error');
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
    console.log('deletePeriod', error.message);
    throw new Error('Internal Server Error');
  }
};

export const changePeriodStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}) => {
  try {
    const period = await db.period.update({
      where: { id },
      data: {
        isActive,
        statusChangedDate: new Date(),
      },
    });

    revalidatePath(pathname);

    return period;
  } catch (error: any) {
    console.log('changePeriodStatus', error.message);
    throw new Error('Internal Server Error');
  }
};
