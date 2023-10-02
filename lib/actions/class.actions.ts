'use server';

import { db } from '../db';

export const createClass = async ({
  name,
  periodId,
  courseId,
}: {
  name: string;
  periodId: string;
  courseId: string;
}) => {
  try {
    return await db.class.create({
      data: {
        name,
        periodId,
        courseId,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to create class: ${error.message}`);
  }
};
