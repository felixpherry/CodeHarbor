'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { Prisma } from '@prisma/client';

export const fetchCategories = async () => {
  try {
    return await db.category.findMany({});
  } catch (error: any) {
    console.log('fetchCategories', error);
    throw new Error('Internal Server Error');
  }
};

export const addNewCategory = async ({
  payload,
  pathname,
}: {
  payload: Prisma.CategoryUncheckedCreateInput;
  pathname: string;
}) => {
  try {
    const category = await db.category.create({
      data: payload,
    });

    revalidatePath(pathname);

    return category;
  } catch (error: any) {
    console.log('addNewCategory', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Category name and age description must be unique');
      }
    }
    throw new Error('Internal Server Error');
  }
};

export const updateCategory = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Prisma.CategoryUncheckedUpdateInput;
  pathname: string;
}) => {
  try {
    const category = await db.category.update({
      where: { id },
      data: payload,
    });

    revalidatePath(pathname);

    return category;
  } catch (error: any) {
    console.log('updateCategory', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Category name and age description must be unique');
      }
    }
    throw new Error('Internal Server Error');
  }
};

export const deleteCategory = async ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) => {
  try {
    const category = await db.category.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return category;
  } catch (error: any) {
    console.log('deleteCategory', error.message);
    throw new Error('Internal Server Error');
  }
};
