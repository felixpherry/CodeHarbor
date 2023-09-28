'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';

export const fetchFaq = async () => {
  try {
    return await db.faq.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch FAQ: ${error.message}`);
  }
};

export const updateFaq = async (
  faq: Array<{ answer: string; question: string }>,
  pathname: string
) => {
  const data = faq.map(({ question, answer }, idx) => ({
    id: (idx + 1).toString(),
    question,
    answer,
  }));
  try {
    await db.$transaction([
      db.faq.deleteMany(),
      db.faq.createMany({
        data,
      }),
    ]);

    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update FAQ: ${error.message}`);
  }
};
