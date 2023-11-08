'use server';

import { db } from '../db';

export const getCurrentPeriod = async () => {
  try {
    return await db.period.findFirst({
      where: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch the current period: ${error.message}`);
  }
};

export const getNextPeriod = async () => {
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
    throw new Error(`Failed to fetch the next period: ${error.message}`);
  }
};
