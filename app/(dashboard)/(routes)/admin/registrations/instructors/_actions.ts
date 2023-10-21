'use server';

import { db } from '@/lib/db';
import { InstructorRegistration, RegistrationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import moment from 'moment';

export const updateInstructorRegistrationStatus = async ({
  id,
  status,
  pathname,
}: {
  id: string;
  status: RegistrationStatus;
  pathname: string;
}) => {
  try {
    const data = await db.instructorRegistration.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    revalidatePath(pathname);
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to update registration status: ${error.message}`);
  }
};

export const fetchInstructorRegistrationDetail = async (id: string) => {
  try {
    return await db.instructorRegistration.findUnique({
      where: { id },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch instructor registration detail: ${error.message}`
    );
  }
};

export const createAccountForInstructor = async (
  payload: {
    skills: {
      id: string;
      name: string;
    }[];
  } & InstructorRegistration
) => {
  try {
    const {
      address,
      dateOfBirth,
      educationInstitution,
      email,
      lastEducation,
      name,
      phoneNumber,
      skills,
    } = payload;

    const hashedPassword = await bcrypt.hash(
      moment(dateOfBirth).format('DDMMYYYY'),
      10
    );

    const account = await db.account.create({
      data: {
        email,
        name,
        role: 'INSTRUCTOR',
        address,
        instructor: {
          create: {
            dateOfBirth,
            educationInstitution,
            lastEducation,
            skills: {
              connect: skills.map(({ id }) => ({ id })),
            },
          },
        },
        password: hashedPassword,
        phoneNumber,
      },
    });
    return {
      email: account.email,
      password: moment(dateOfBirth).format('DDMMYYYY'),
    };
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to create account for student: ${error.message}`);
  }
};
