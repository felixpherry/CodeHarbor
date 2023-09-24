'use server';

import { db } from '../db';

export const fetchFaq = async () => {
  try {
    return await db.faq.findMany();
  } catch (error: any) {
    throw new Error(`Failed to fetch FAQ: ${error.message}`);
  }
};
