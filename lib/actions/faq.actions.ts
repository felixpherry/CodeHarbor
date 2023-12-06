'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';

export const fetchFaq = async () => {
  try {
    return await db.faq.findMany({
      orderBy: {
        question: 'asc',
      },
    });
  } catch (error: any) {
    console.log('fetchFaq', error);
    throw new Error('Internal Server Error');
  }
};

export const addNewFaq = async (
  question: string,
  answer: string,
  pathname: string
) => {
  try {
    const faq = await db.faq.create({
      data: {
        question,
        answer,
      },
    });

    revalidatePath(pathname);
    return faq;
  } catch (error: any) {
    console.log('addNewFaq', error);
    throw new Error('Internal Server Error');
  }
};

export const updateFaq = async (
  id: string,
  question: string,
  answer: string,
  pathname: string
) => {
  try {
    const faq = await db.faq.update({
      where: { id },
      data: {
        question,
        answer,
      },
    });

    revalidatePath(pathname);
    return faq;
  } catch (error: any) {
    console.log('updateFaq', error);
    throw new Error('Internal Server Error');
  }
};

export const deleteFaq = async (id: string, pathname: string) => {
  try {
    const faq = await db.faq.delete({
      where: { id },
    });

    revalidatePath(pathname);
    return faq;
  } catch (error: any) {
    console.log('deleteFaq', error);
    throw new Error('Internal Server Error');
  }
};
