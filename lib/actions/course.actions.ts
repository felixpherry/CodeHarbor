'use server';

import { revalidatePath, unstable_cache } from 'next/cache';
import { db } from '../db';
import { Prisma } from '@prisma/client';
import { authorizeByRoles } from '../authorization';

export const getPublishedCourses = unstable_cache(
  async () => {
    try {
      return await db.course.findMany({
        where: {
          isPublished: true,
          program: {
            isPublished: true,
          },
        },
      });
    } catch (error: any) {
      console.log('getPublishedCourses', error);
      throw new Error('Internal Server Error');
    }
  },
  ['publishedCourses'],
  {
    revalidate: 24 * 60 * 60 * 1000,
  }
);

interface AddNewEvaluationParams {
  courseId: string;
  newEvaluation: Prisma.CourseEvaluationUncheckedCreateInput;
  pathname: string;
}

export const addNewEvaluation = async ({
  courseId,
  newEvaluation,
  pathname,
}: AddNewEvaluationParams) => {
  try {
    await authorizeByRoles(['ADMIN']);

    const evaluations = await db.courseEvaluation.findMany({
      where: { courseId, isActive: true },
    });

    const totalCurrentScore = evaluations.reduce(
      (acc, evaluation) => acc + evaluation.weight,
      0
    );

    if (totalCurrentScore + newEvaluation.weight > 100) {
      throw new Error(
        'Total weight of all evaluations should not be greater than 100'
      );
    }

    const sessionReportEvaluation = evaluations.find(
      (evaluation) => evaluation.isSessionReport === true
    );
    if (
      newEvaluation.isSessionReport &&
      sessionReportEvaluation !== undefined
    ) {
      await db.$transaction([
        db.courseEvaluation.update({
          where: { id: sessionReportEvaluation.id },
          data: { isSessionReport: false },
        }),
        db.courseEvaluation.create({
          data: newEvaluation,
        }),
      ]);
    } else {
      await db.courseEvaluation.create({
        data: newEvaluation,
      });
    }

    revalidatePath(pathname);
  } catch (error: any) {
    console.log('addNewEvaluation', error.message);
    throw new Error(error.message);
  }
};

interface DeleteCourseEvaluationParams {
  courseEvaluationId: string;
  pathname: string;
}

export const deleteCourseEvaluation = async ({
  courseEvaluationId,
  pathname,
}: DeleteCourseEvaluationParams) => {
  try {
    await authorizeByRoles(['ADMIN']);

    const evaluation = await db.courseEvaluation.update({
      where: { id: courseEvaluationId },
      data: { isActive: false },
    });

    revalidatePath(pathname);

    return evaluation;
  } catch (error: any) {
    console.log('deleteCourseEvaluation', error.message);
    throw new Error(error.message);
  }
};

interface UpdateCourseEvaluationParams {
  courseId: string;
  evaluationId: string;
  newEvaluation: Prisma.CourseEvaluationUncheckedCreateInput;
  pathname: string;
}

export const updateCourseEvaluation = async ({
  courseId,
  evaluationId,
  newEvaluation,
  pathname,
}: UpdateCourseEvaluationParams) => {
  try {
    await authorizeByRoles(['ADMIN']);

    const evaluations = await db.courseEvaluation.findMany({
      where: { courseId, isActive: true },
    });

    const totalScore = evaluations.reduce(
      (acc, evaluation) =>
        acc +
        (evaluation.id === evaluationId
          ? newEvaluation.weight
          : evaluation.weight),
      0
    );

    if (totalScore > 100) {
      throw new Error(
        'Total weight of all evaluations should not be greater than 100'
      );
    }

    const sessionReportEvaluation = evaluations.find(
      (evaluation) =>
        evaluation.isSessionReport === true && evaluationId !== evaluation.id
    );

    if (
      newEvaluation.isSessionReport &&
      sessionReportEvaluation !== undefined
    ) {
      await db.$transaction([
        db.courseEvaluation.update({
          where: { id: sessionReportEvaluation.id },
          data: { isSessionReport: false },
        }),
        db.courseEvaluation.update({
          data: newEvaluation,
          where: {
            id: evaluationId,
          },
        }),
      ]);
    } else {
      await db.courseEvaluation.update({
        data: newEvaluation,
        where: {
          id: evaluationId,
        },
      });
    }

    revalidatePath(pathname);
  } catch (error: any) {
    console.log('updateCourseEvaluation', error.message);
    throw new Error(error.message);
  }
};

interface PublishCourseParams {
  courseId: string;
  pathname: string;
}

export const publishCourse = async ({
  courseId,
  pathname,
}: PublishCourseParams) => {
  try {
    await authorizeByRoles(['ADMIN']);
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        sessions: {
          where: {
            isPublished: true,
          },
        },
        evaluations: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!course) throw new Error('Course is not found');

    const hasSessionReportEvaluation = course.evaluations.find(
      ({ isSessionReport }) => isSessionReport === true
    );

    if (!hasSessionReportEvaluation)
      throw new Error("Course doesn't have evaluation for session report yet");

    const totalEvaluationWeight = course.evaluations.reduce(
      (curr, { weight }) => curr + weight,
      0
    );

    if (totalEvaluationWeight !== 100)
      throw new Error('Total weight of the course evaluation should be 100');

    if (course.sessions.length === 0)
      throw new Error('Course should have at least 1 session');

    const newCourse = await db.course.update({
      where: { id: course.id },
      data: {
        isPublished: true,
      },
    });

    revalidatePath(pathname);
    return newCourse;
  } catch (error: any) {
    console.log('publishCourse', error.message);
    throw new Error(error.message);
  }
};
