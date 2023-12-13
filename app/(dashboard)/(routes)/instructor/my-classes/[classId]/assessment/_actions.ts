'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface AddStudentScoresParams {
  evaluationId: string;
  classId: string;
  studentScores: {
    studentId: string;
    score: number;
  }[];
  pathname: string;
}

export const addStudentScores = async ({
  classId,
  evaluationId,
  pathname,
  studentScores,
}: AddStudentScoresParams) => {
  try {
    const res = await db.studentScore.createMany({
      data: studentScores.map(({ score, studentId }) => ({
        classId,
        evaluationId,
        score,
        studentId,
      })),
    });

    revalidatePath(pathname);

    return res;
  } catch (error: any) {
    console.log('addStudentScores', error.message);
    throw new Error(error.message);
  }
};
