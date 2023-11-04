'use server';

import { db } from '../db';

export const getCurrentPeriod = async () => {
  try {
    return await db.period.findFirst({
      where: {
        startDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to get current period: ${error.message}`);
  }
};
