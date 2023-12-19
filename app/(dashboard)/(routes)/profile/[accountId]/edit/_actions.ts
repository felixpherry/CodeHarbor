'use server';

import { db } from '@/lib/db';
import { Gender, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';

interface UpdateAccountParams {
  id: string;
  username: string;
  phoneNumber: string;
  address: string;
  pathname: string;
}

export const updateAccount = async ({
  id,
  address,
  pathname,
  phoneNumber,
  username,
}: UpdateAccountParams) => {
  try {
    const account = await db.account.update({
      where: { id },
      data: {
        address,
        phoneNumber,
        username,
      },
    });

    revalidatePath(pathname);

    return account;
  } catch (error: any) {
    console.log('updateAccount', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Username must be unique');
      }
    }
    throw new Error(error.message);
  }
};

interface ChangePasswordParams {
  id: string;
  currentPassword: string;
  newPassword: string;
  pathname: string;
}

export const changePassword = async ({
  id,
  currentPassword,
  newPassword,
  pathname,
}: ChangePasswordParams) => {
  try {
    const account = await db.account.findUnique({
      where: { id },
    });

    if (!account) throw new Error('Account not found');

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      account.password!
    );

    if (!passwordMatch) throw new Error("Current password didn't match");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const newAccount = await db.account.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    revalidatePath(pathname);

    return newAccount;
  } catch (error: any) {
    console.log('changePassword', error.message);
    throw new Error(error.message);
  }
};

interface UpdateStudentInfoParams {
  id: string;
  birthPlace: string;
  dateOfBirth: Date;
  gender: Gender;
  gradeClass: string;
  educationInstitution: string;
  hobby: string;
  ambition: string;
  pathname: string;
}

export const updateStudentInfo = async ({
  id,
  ambition,
  birthPlace,
  dateOfBirth,
  educationInstitution,
  gender,
  gradeClass,
  hobby,
  pathname,
}: UpdateStudentInfoParams) => {
  try {
    const student = await db.student.update({
      where: { id },
      data: {
        ambition,
        birthPlace,
        dateOfBirth,
        educationInstitution,
        gender,
        hobby,
        gradeClass,
      },
    });

    revalidatePath(pathname);

    return student;
  } catch (error: any) {
    console.log('updateStudentInfo', error.message);
    throw new Error(error.message);
  }
};

export const fetchSkills = async () => {
  try {
    return await db.skill.findMany({
      where: { isActive: true },
    });
  } catch (error: any) {
    console.log('fetchSkills', error.message);
    throw new Error(error.message);
  }
};

interface UpdateInstructorInfoParams {
  id: string;
  dateOfBirth: Date;
  lastEducation: string;
  educationInstitution: string;
  skillIds: string[];
  pathname: string;
}

export const updateInstructorInfo = async ({
  dateOfBirth,
  educationInstitution,
  id,
  lastEducation,
  skillIds,
  pathname,
}: UpdateInstructorInfoParams) => {
  try {
    const instructor = await db.instructor.update({
      where: { id },
      data: {
        dateOfBirth,
        educationInstitution,
        lastEducation,
        skills: {
          set: skillIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath(pathname);

    return instructor;
  } catch (error: any) {
    console.log('updateInstructorInfo', error.message);
    throw new Error(error.message);
  }
};
