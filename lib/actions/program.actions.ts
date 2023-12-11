'use server';

import { Program, Session, Course } from '@prisma/client';
import { db } from '../db';
import { revalidatePath } from 'next/cache';

export const fetchPrograms = async (categoryId: string = '') => {
  try {
    return await db.program.findMany();
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

export const fetchProgramById = async (id: string) => {
  try {
    return await db.program.findUnique({
      where: {
        id,
      },
      include: {
        courses: true,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch program: ${error.message}`);
  }
};

export const createProgram = async ({
  name,
  accountId,
}: {
  name: string;
  accountId: string;
}) => {
  try {
    const admin = await db.admin.findUnique({
      where: {
        accountId,
      },
    });

    if (!admin) throw new Error('Unauthorized');
    return await db.program.create({
      data: {
        name,
        userId: admin.id,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to create program: ${error.message}`);
  }
};

export const updateProgram = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Partial<Program>;
  pathname: string;
}) => {
  try {
    await db.program.update({
      data: payload,
      where: {
        id,
      },
    });
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update program: ${error.message}`);
  }
};

export const deleteProgram = async (id: string) => {
  try {
    const program = await db.program.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    return program;
  } catch (error: any) {
    throw new Error(`Failed to delete program: ${error.message}`);
  }
};

export const fetchCourseById = async ({
  courseId,
  programId,
}: {
  courseId: string;
  programId: string;
}) => {
  try {
    return await db.course.findUnique({
      where: { id: courseId, programId },
      include: {
        sessions: {
          orderBy: {
            sessionNumber: 'asc',
          },
        },
        evaluations: {
          where: {
            isActive: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch course: ${error.message}`);
  }
};

export const addCourse = async ({
  name,
  programId,
  pathname,
}: {
  name: string;
  programId: string;
  pathname: string;
}) => {
  try {
    const course = await db.course.create({
      data: {
        name,
        program: {
          connect: {
            id: programId,
          },
        },
      },
    });

    revalidatePath(pathname);
    return course;
  } catch (error: any) {
    throw new Error(`Failed to add course: ${error.message}`);
  }
};

export const updateCourse = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Partial<Course>;
  pathname: string;
}) => {
  try {
    const course = await db.course.update({
      data: payload,
      where: {
        id,
      },
    });

    if (payload?.isPublished === false && payload.programId) {
      const publishedCoursesInPrograms = await db.course.findMany({
        where: {
          programId: course.programId,
          isPublished: true,
        },
      });

      if (!publishedCoursesInPrograms.length) {
        await db.program.update({
          where: {
            id: course.programId,
          },
          data: {
            isPublished: false,
          },
        });
      }
    }
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update course: ${error.message}`);
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const course = await db.course.update({
      where: {
        id,
      },
      data: { isDeleted: true },
    });

    const publishedCourseInPrograms = await db.course.findMany({
      where: {
        programId: course.programId,
        isPublished: true,
        isDeleted: false,
      },
    });

    if (!publishedCourseInPrograms.length) {
      await db.program.update({
        where: {
          id: course.programId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return course;
  } catch (error: any) {
    throw new Error(`Failed to delete course: ${error.message}`);
  }
};

export const addSession = async ({
  main,
  courseId,
  pathname,
}: {
  main: string;
  courseId: string;
  pathname: string;
}) => {
  try {
    const lastSession = await db.session.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        sessionNumber: 'desc',
      },
    });

    const session = await db.session.create({
      data: {
        main,
        sessionNumber: (lastSession?.sessionNumber || 0) + 1,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    revalidatePath(pathname);
    return session;
  } catch (error: any) {
    throw new Error(`Failed to add session: ${error.message}`);
  }
};

export const reorderSessions = async ({
  updateData,
  pathname,
}: {
  updateData: {
    id: string;
    sessionNumber: number;
  }[];
  pathname: string;
}) => {
  try {
    updateData.forEach(async ({ id, sessionNumber }) => {
      await db.session.update({
        data: {
          sessionNumber,
        },
        where: {
          id,
        },
      });
    });
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to reorder sessions: ${error.message}`);
  }
};

export const fetchSessionById = async ({
  courseId,
  sessionId,
}: {
  courseId: string;
  sessionId: string;
}) => {
  try {
    return await db.session.findUnique({
      where: {
        id: sessionId,
        courseId: courseId,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch session: ${error.message}`);
  }
};

export const updateSession = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Partial<Session>;
  pathname: string;
}) => {
  try {
    await db.session.update({
      data: payload,
      where: {
        id,
      },
    });

    if (payload?.isPublished === false && payload.courseId) {
      const publishedSessionsInCourses = await db.session.findMany({
        where: {
          courseId: payload.courseId,
          isPublished: true,
        },
      });

      if (!publishedSessionsInCourses.length) {
        const course = await db.course.update({
          where: {
            id: payload.courseId,
          },
          data: {
            isPublished: false,
          },
        });

        const publishedCoursesInPrograms = await db.course.findMany({
          where: {
            programId: course.programId,
            isPublished: true,
          },
        });

        if (!publishedCoursesInPrograms.length) {
          await db.program.update({
            where: {
              id: course.programId,
            },
            data: {
              isPublished: false,
            },
          });
        }
      }
    }
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update session: ${error.message}`);
  }
};

export const deleteSession = async (id: string) => {
  try {
    const session = await db.session.delete({
      where: {
        id,
      },
    });

    const publishedSessionsInCourses = await db.session.findMany({
      where: {
        courseId: session.courseId,
        isPublished: true,
      },
    });

    if (!publishedSessionsInCourses.length) {
      const course = await db.course.update({
        where: {
          id: session.courseId,
        },
        data: {
          isPublished: false,
        },
      });

      const publishedCoursesInPrograms = await db.course.findMany({
        where: {
          programId: course.programId,
          isPublished: true,
        },
      });

      if (!publishedCoursesInPrograms.length) {
        await db.program.update({
          where: {
            id: course.programId,
          },
          data: {
            isPublished: false,
          },
        });
      }
    }

    return session;
  } catch (error: any) {
    throw new Error(`Failed to delete session: ${error.message}`);
  }
};

export const addAttachment = async ({
  filename,
  fileUrl,
  fileType,
  sessionId,
  pathname,
}: {
  filename: string;
  fileUrl: string;
  fileType: string;
  sessionId: string;
  pathname: string;
}) => {
  try {
    await db.attachment.create({
      data: {
        filename,
        fileUrl,
        fileType,
        session: {
          connect: {
            id: sessionId,
          },
        },
      },
    });

    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to add attachment: ${error.message}`);
  }
};

export const deleteAttachment = async (id: string, pathname: string) => {
  try {
    await db.attachment.delete({
      where: { id },
    });

    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to delete attachment: ${error.message}`);
  }
};
