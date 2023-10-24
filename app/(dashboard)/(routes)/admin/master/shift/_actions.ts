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
    throw new Error(`Error creating shift ${pathname}: ${error.message}`);
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
    throw new Error(`Error updating shift ${pathname}: ${error.message}`);
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
    throw new Error(`Error deleting shift: ${pathname}: ${error.message}`);
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
      data: { isActive },
    });

    revalidatePath(pathname);

    return shift;
  } catch (error: any) {
    throw new Error(
      `Error changing shift status: ${pathname}: ${error.message}`
    );
  }
};
