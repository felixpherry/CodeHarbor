'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';

export const fetchHero = async () => {
  try {
    // await db.hero.create({
    //   data: {
    //     title: 'Bangun Potensi Kreativitas Anak-anak Lewat Coding',
    //     subtitle:
    //       'Membantu mengembangkan Kreativitas, Karakter, dan Pemikiran Logis Anak-anak Melalui Kursus Coding',
    //     image:
    //       'https://res.cloudinary.com/dgtch1ffs/image/upload/v1694706169/jp3trbbu5jx2avsyeuvk.png',
    //   },
    // });
    const hero = await db.hero.findFirst();
    return hero;
  } catch (error: any) {
    throw new Error(`Failed to fetch hero: ${error.message}`);
  }
};

interface Hero {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export const updateHero = async (
  { id, title, subtitle, image }: Hero,
  pathname: string
) => {
  try {
    await db.hero.update({
      where: {
        id,
      },
      data: {
        title,
        subtitle,
        image,
      },
    });
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update hero: ${error.message}`);
  }
};
