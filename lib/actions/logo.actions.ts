'use server';

import { revalidatePath, unstable_cache } from 'next/cache';
import { db } from '../db';

export const fetchLogo = unstable_cache(
  async () => {
    try {
      return await db.logo.findFirst();
    } catch (error: any) {
      throw new Error(`Failed to fetch logo: ${error.message}`);
    }
  },
  ['logo'],
  {
    revalidate: 24 * 60 * 60 * 1000,
  }
);

interface UpdateLogoProps {
  id: string;
  image: string;
  pathname: string;
}

export const updateLogo = async ({ id, image, pathname }: UpdateLogoProps) => {
  try {
    await db.logo.update({
      data: {
        image,
      },
      where: {
        id,
      },
    });

    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update logo: ${error.message}`);
  }
};
