'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

interface AddNewEvaluationParams {
  payload: Prisma.MasterEvaluationCreateInput;
  pathname: string;
}

export const addNewEvaluation = async ({
  payload,
  pathname,
}: AddNewEvaluationParams) => {
  try {
    const evaluation = await db.masterEvaluation.create({
      data: payload,
    });

    revalidatePath(pathname);

    return evaluation;
  } catch (error: any) {
    throw new Error(`Failed to add new evaluation: ${error.message}`);
  }
};

interface UpdateEvaluationParams {
  id: string;
  payload: Prisma.MasterEvaluationCreateInput;
  pathname: string;
}

export const updateEvaluation = async ({
  id,
  payload,
  pathname,
}: UpdateEvaluationParams) => {
  try {
    const evaluation = await db.masterEvaluation.update({
      data: payload,
      where: { id },
    });

    revalidatePath(pathname);

    return evaluation;
  } catch (error: any) {
    throw new Error(`Failed to update evaluation: ${error.message}`);
  }
};

interface DeleteEvaluationParams {
  id: string;
  pathname: string;
}

export const deleteEvaluation = async ({
  id,
  pathname,
}: DeleteEvaluationParams) => {
  try {
    const evaluation = await db.masterEvaluation.delete({
      where: { id },
    });

    revalidatePath(pathname);
    return evaluation;
  } catch (error: any) {
    throw new Error(`Failed to delete evaluation: ${error.message}`);
  }
};
