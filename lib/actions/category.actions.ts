'use server';

import { db } from '../db';

export const fetchCategories = async () => {
  try {
    return await db.category.findMany();
  } catch (error: any) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};
