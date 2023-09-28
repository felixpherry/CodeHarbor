'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';

export const fetchLogo = async () => {
  try {
    return await db.logo.findFirst();
  } catch (error: any) {
    throw new Error(`Failed to fetch logo: ${error.message}`);
  }
};

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
