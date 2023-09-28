'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';

export const fetchCategories = async () => {
  try {
    return await db.category.findMany({});
  } catch (error: any) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

export const updateCategories = async (
  newCategories: Array<{ name: string }>,
  updatedCategories: Array<{ id: string; name: string }>,
  deletedIds: string[],
  pathname: string
) => {
  try {
    console.log(deletedIds);
    await db.$transaction([
      db.category.deleteMany({
        where: {
          id: {
            in: deletedIds,
          },
        },
      }),
      db.category.createMany({
        data: newCategories.map(({ name }) => ({
          name,
        })),
      }),
    ]);

    updatedCategories.forEach(async ({ id, name }) => {
      await db.category.update({
        data: {
          name,
        },
        where: {
          id,
        },
      });
    });

    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update FAQ: ${error.message}`);
  }
};
