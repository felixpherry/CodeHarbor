'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const addNewShift = async ({
  payload,
  pathname,
}: {
  payload: Prisma.MasterShiftUncheckedCreateInput;
  pathname: string;
}) => {
  try {
    const shift = await db.masterShift.create({
      data: payload,
    });

    revalidatePath(pathname);
    return shift;
  } catch (error: any) {
    console.log('addNewShift', error.message);
    throw new Error('Internal Server Error');
  }
};

export const updateShift = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Prisma.MasterShiftUncheckedUpdateInput;
  pathname: string;
}) => {
  try {
    const shift = await db.masterShift.update({
      where: { id },
      data: payload,
    });

    revalidatePath(pathname);

    return shift;
  } catch (error: any) {
    console.log('updateShift', error.message);
    throw new Error('Internal Server Error');
  }
};

export const deleteShift = async ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) => {
  try {
    const shift = await db.masterShift.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return shift;
  } catch (error: any) {
    console.log('deleteShift', error.message);
    throw new Error('Internal Server Error');
  }
};

export const changeShiftStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}) => {
  try {
    const shift = await db.masterShift.update({
      where: { id },
      data: { isActive, statusChangedDate: new Date() },
    });

    revalidatePath(pathname);

    return shift;
  } catch (error: any) {
    console.log('changeShiftStatus', error.message);
    throw new Error('Internal Server Error');
  }
};
