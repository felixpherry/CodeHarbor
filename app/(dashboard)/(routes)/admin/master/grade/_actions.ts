'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

interface AddNewGradeCategoryParams {
  payload: Prisma.MasterGradeCreateInput;
  pathname: string;
}

export const addNewGradeCategory = async ({
  pathname,
  payload,
}: AddNewGradeCategoryParams) => {
  try {
    const gradeCategory = await db.masterGrade.create({
      data: {
        category: payload.category,
        description: payload.description,
        minScore: payload.minScore,
        maxScore: payload.maxScore,
        hexCode: payload.hexCode,
      },
    });
    revalidatePath(pathname);

    return gradeCategory;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to add new grade category: ${error.message}`);
  }
};

interface UpdateGradeCategoryParams {
  id: string;
  payload: Prisma.MasterGradeUpdateInput;
  pathname: string;
}

export const updateGradeCategory = async ({
  id,
  pathname,
  payload,
}: UpdateGradeCategoryParams) => {
  try {
    const gradeCategory = await db.masterGrade.update({
      data: payload,
      where: { id },
    });
    revalidatePath(pathname);

    return gradeCategory;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to add new grade category: ${error.message}`);
  }
};

interface DeleteGradeCategoryParams {
  id: string;
  pathname: string;
}

export const deleteGradeCategory = async ({
  id,
  pathname,
}: DeleteGradeCategoryParams) => {
  try {
    const gradeCategory = await db.masterGrade.delete({
      where: { id },
    });
    revalidatePath(pathname);

    return gradeCategory;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to add new grade category: ${error.message}`);
  }
};
