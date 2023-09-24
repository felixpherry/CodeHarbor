'use server';

import { db } from '../db';

export const fetchPrograms = async (categoryId: string = '') => {
  try {
    const where = categoryId ? { categoryId } : {};
    return await db.program.findMany({ where });
  } catch (error: any) {
    throw new Error(`Failed to fetch program: ${error.message}`);
  }
};

export const fetchProgramDetail = async (id: string) => {
  try {
    return await db.program.findUnique({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch program detail: ${error.message}`);
  }
};
