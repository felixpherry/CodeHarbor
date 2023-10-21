'use server';

import { db } from '@/lib/db';
import { Status } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const updateAccountStatus = async ({
  id,
  status,
  pathname,
}: {
  id: string;
  status: Status;
  pathname: string;
}) => {
  try {
    const account = await db.account.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    revalidatePath(pathname);
    return account;
  } catch (error: any) {
    throw new Error(`Failed to update account status: ${error.message}`);
  }
};
