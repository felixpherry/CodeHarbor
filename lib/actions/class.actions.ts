'use server';

import { db } from '../db';

export const createClass = async ({
  name,
  periodId,
  subprogramId,
}: {
  name: string;
  periodId: string;
  subprogramId: string;
}) => {
  try {
    return await db.class.create({
      data: {
        name,
        periodId,
        subprogramId,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to create class: ${error.message}`);
  }
};
