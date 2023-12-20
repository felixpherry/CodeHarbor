'use server';

import { db } from '../db';

export const getChildAccountId = async (accountId: string) => {
  try {
    const childAccount = await db.account.findFirst({
      where: {
        student: {
          parent: { accountId },
        },
      },
    });

    return childAccount?.id || null;
  } catch (error: any) {
    console.log('getChildAccountId', error.message);
    throw new Error(error.message);
  }
};
