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
    console.log('addNewGradeCategory', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error(
          'Category name, min score, and max score must be unique'
        );
      }
    }
    throw new Error('Internal Server Error');
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
    console.log('updateGradeCategory', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error(
          'Category name, min score, and max score must be unique'
        );
      }
    }
    throw new Error('Internal Server Error');
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
    console.log('deleteGradeCategory', error.message);
    throw new Error('Internal Server Error');
  }
};

interface ChangeGradeCategoryStatusParams {
  id: string;
  isActive: boolean;
  pathname: string;
}

export const changeGradeCategoryStatus = async ({
  id,
  isActive,
  pathname,
}: ChangeGradeCategoryStatusParams) => {
  try {
    const grade = await db.masterGrade.update({
      where: { id },
      data: {
        isActive,
        statusChangedDate: new Date(),
      },
    });

    revalidatePath(pathname);

    return grade;
  } catch (error: any) {
    console.log('changeGradeCategoryStatus', error.message);
    throw new Error('Internal Server Error');
  }
};
