'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const addNewSkill = async ({
  payload,
  pathname,
}: {
  payload: Prisma.SkillUncheckedCreateInput;
  pathname: string;
}) => {
  try {
    const skill = await db.skill.create({
      data: payload,
    });

    revalidatePath(pathname);
    return skill;
  } catch (error: any) {
    console.log('addNewSkill', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Skill name must be unique');
      }
    }
    throw new Error('Internal Server Error');
  }
};

export const updateSkill = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Prisma.SkillUncheckedCreateInput;
  pathname: string;
}) => {
  try {
    const skill = await db.skill.update({
      where: { id },
      data: payload,
    });

    revalidatePath(pathname);

    return skill;
  } catch (error: any) {
    console.log('updateSkill', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Skill name must be unique');
      }
    }
    throw new Error('Internal Server Error');
  }
};

export const deleteSkill = async ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) => {
  try {
    const skill = await db.skill.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return skill;
  } catch (error: any) {
    console.log('deleteSkill', error.message);
    throw new Error('Internal Server Error');
  }
};

export const changeSkillStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}) => {
  try {
    const skill = await db.skill.update({
      where: { id },
      data: { isActive, statusChangedDate: new Date() },
    });

    revalidatePath(pathname);

    return skill;
  } catch (error: any) {
    console.log('changeSkillStatus', error.message);
    throw new Error('Internal Server Error');
  }
};
