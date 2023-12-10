'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const addNewCoupon = async ({
  payload,
  pathname,
}: {
  payload: Prisma.CouponUncheckedCreateInput;
  pathname: string;
}) => {
  try {
    const coupon = await db.coupon.create({
      data: payload,
    });

    revalidatePath(pathname);
    return coupon;
  } catch (error: any) {
    console.log('addNewCoupon', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Coupon code must be unique');
      }
    }
    throw new Error('Internal Server Error');
  }
};

export const updateCoupon = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Prisma.CouponUncheckedCreateInput;
  pathname: string;
}) => {
  try {
    const coupon = await db.coupon.update({
      where: { id },
      data: payload,
    });

    revalidatePath(pathname);

    return coupon;
  } catch (error: any) {
    console.log('updateCoupon', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Coupon code must be unique');
      }
    }
    throw new Error('Internal Server Error');
  }
};

export const deleteCoupon = async ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) => {
  try {
    const coupon = await db.coupon.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return coupon;
  } catch (error: any) {
    console.log('deleteCoupon', error.message);
    throw new Error('Internal Server Error');
  }
};

export const updateCouponStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}) => {
  try {
    const coupon = await db.coupon.update({
      where: { id },
      data: { isActive, statusChangedDate: new Date() },
    });

    revalidatePath(pathname);

    return coupon;
  } catch (error: any) {
    console.log('updateCouponStatus', error.message);
    throw new Error('Internal Server Error');
  }
};
