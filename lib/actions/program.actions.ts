'use server';

import { Program, Session, Subprogram } from '@prisma/client';
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
        subprograms: true,
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

export const fetchSubprogramById = async ({
  subprogramId,
  programId,
}: {
  subprogramId: string;
  programId: string;
}) => {
  try {
    return await db.subprogram.findUnique({
      where: { id: subprogramId, programId },
      include: {
        sessions: {
          orderBy: {
            sessionNumber: 'asc',
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch subprogram: ${error.message}`);
  }
};

export const addSubprogram = async ({
  name,
  programId,
  pathname,
}: {
  name: string;
  programId: string;
  pathname: string;
}) => {
  try {
    const subprogram = await db.subprogram.create({
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
    return subprogram;
  } catch (error: any) {
    throw new Error(`Failed to add subprogram: ${error.message}`);
  }
};

export const updateSubprogram = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Partial<Subprogram>;
  pathname: string;
}) => {
  try {
    await db.subprogram.update({
      data: payload,
      where: {
        id,
      },
    });
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update subprogram: ${error.message}`);
  }
};

export const addSession = async ({
  main,
  subprogramId,
  pathname,
}: {
  main: string;
  subprogramId: string;
  pathname: string;
}) => {
  try {
    const lastSession = await db.session.findFirst({
      where: {
        subprogramId,
      },
      orderBy: {
        sessionNumber: 'desc',
      },
    });

    const session = await db.session.create({
      data: {
        main,
        sessionNumber: (lastSession?.sessionNumber || 0) + 1,
        subprogram: {
          connect: {
            id: subprogramId,
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
  subprogramId,
  sessionId,
}: {
  subprogramId: string;
  sessionId: string;
}) => {
  try {
    return await db.session.findUnique({
      where: {
        id: sessionId,
        subprogramId: subprogramId,
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
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update session: ${error.message}`);
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
