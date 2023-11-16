'use server';

import { db } from '../db';
import { unstable_cache } from 'next/cache';

export const getAllPeriods = unstable_cache(
  async () => {
    try {
      return await db.period.findMany();
    } catch (error: any) {
      throw new Error(`Failed to fetch the current period: ${error.message}`);
    }
  },
  ['allPeriods'],
  {
    revalidate: 24 * 60 * 60 * 1000,
  }
);

export const getCurrentPeriod = unstable_cache(
  async () => {
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
  },
  ['currentPeriod'],
  {
    revalidate: 24 * 60 * 60 * 1000,
  }
);

export const getNextPeriod = unstable_cache(
  async () => {
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
  },
  ['nextPeriod'],
  {
    revalidate: 24 * 60 * 60 * 1000,
  }
);
