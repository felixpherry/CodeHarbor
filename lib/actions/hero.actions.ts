'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { Hero } from '@prisma/client';
import { utapi } from '@/app/api/uploadthing/core';

export const fetchHero = async () => {
  try {
    const hero = await db.hero.findFirst();
    return hero;
  } catch (error: any) {
    console.log('fetchHero', error);
    throw new Error('Internal Server Error');
  }
};

interface CreateOrUpdateHeroParams {
  payload: {
    title: string;
    subtitle: string;
    image: string;
    fileKey: string | null;
  };
  pathname: string;
}

export const createOrUpdateHero = async ({
  pathname,
  payload,
}: CreateOrUpdateHeroParams) => {
  try {
    const { fileKey, image, subtitle, title } = payload;

    const existingHero = await db.hero.findFirst();
    let hero: Hero | null = null;
    if (!existingHero) {
      hero = await db.hero.create({
        data: {
          image,
          subtitle,
          title,
          fileKey,
        },
      });
    } else {
      if (payload.fileKey !== existingHero.fileKey && existingHero.fileKey) {
        await utapi.deleteFiles(existingHero.fileKey);
      }
      hero = await db.hero.update({
        where: { id: existingHero.id },
        data: {
          fileKey,
          image,
          subtitle,
          title,
        },
      });
    }

    revalidatePath(pathname);

    return hero;
  } catch (error: any) {
    console.log('createOrUpdateHero', error);
    throw new Error('Internal Server Error');
  }
};
