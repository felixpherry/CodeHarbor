'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { Category } from '@prisma/client';

export const fetchCategories = async () => {
  try {
    return await db.category.findMany({});
  } catch (error: any) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

export const updateCategories = async (
  newCategories: Category[],
  updatedCategories: Category[],
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
        data: newCategories.map(({ name, ageDescription }) => ({
          name,
          ageDescription,
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
