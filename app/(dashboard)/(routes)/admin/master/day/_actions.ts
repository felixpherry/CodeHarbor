'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const changeDayStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}) => {
  try {
    const day = await db.masterDay.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });

    revalidatePath(pathname);

    return day;
  } catch (error: any) {
    throw new Error(`Failed to change day status: ${error.message}`);
  }
};
