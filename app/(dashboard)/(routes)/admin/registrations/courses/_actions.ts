'use server';

import { db } from '@/lib/db';
import { CourseRegistration, RegistrationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { getCurrentPeriod } from '@/lib/actions/period.actions';

export const updateCourseRegistrationStatus = async ({
  id,
  status,
  pathname,
}: {
  id: string;
  status: RegistrationStatus;
  pathname: string;
}) => {
  try {
    const data = await db.courseRegistration.update({
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

export const fetchCourseRegistrationDetail = async (id: string) => {
  try {
    return await db.courseRegistration.findUnique({
      where: { id },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch course registration detail: ${error.message}`
    );
  }
};

export const createAccountForStudent = async (payload: CourseRegistration) => {
  try {
    const {
      childEmail,
      address,
      birthPlace,
      childGender,
      childName,
      courseId,
      dateOfBirth,
      educationInstitution,
      parentEmail,
      gradeClass,
      parentName,
      phoneNumber,
    } = payload;

    const hashedPassword = await bcrypt.hash(
      moment(dateOfBirth).format('DDMMYYYY'),
      10
    );
    const date = new Date();
    const studentId = `${date.getFullYear() % 100}${
      date.getMonth() < 9 ? '0' + `${date.getMonth() + 1}` : date.getMonth() + 1
    }${Date.now() % 1000000}`;

    const period = await getCurrentPeriod();

    if (!period) throw new Error("There's no period");

    const account = await db.account.create({
      data: {
        email: childEmail,
        name: childName,
        role: 'STUDENT',
        address,
        password: hashedPassword,
        student: {
          create: {
            birthPlace,
            dateOfBirth,
            educationInstitution,
            gender: childGender,
            gradeClass,
            studentId,
            parent: {
              create: {
                account: {
                  create: {
                    email: parentEmail,
                    name: parentName,
                    role: 'PARENT',
                    address,
                    password: hashedPassword,
                    phoneNumber,
                  },
                },
              },
            },
            studentCourses: {
              create: {
                status: 'APPROVED',
                courseId,
                periodId: period.id,
              },
            },
          },
        },
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
