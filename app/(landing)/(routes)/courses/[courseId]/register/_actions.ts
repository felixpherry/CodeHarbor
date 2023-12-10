'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const fetchCouponByCode = async (code: string) => {
  try {
    return await db.coupon.findUnique({
      where: {
        code,
        expiredAt: {
          gt: new Date(),
        },
        isActive: true,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Error fetching coupon: ${error.message}`);
  }
};

export const registerCourse = async ({
  payload,
}: {
  payload: Prisma.CourseRegistrationUncheckedCreateInput;
}) => {
  try {
    await db.courseRegistration.create({
      data: payload,
    });
  } catch (error: any) {
    console.log({ error });
    throw new Error(`Error registering course: ${error.message}`);
  }
};
