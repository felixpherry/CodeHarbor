'use server';

import { unstable_cache } from 'next/cache';
import { db } from '../db';

export const getPublishedCourses = unstable_cache(
  async () => {
    try {
      return await db.course.findMany({
        where: {
          isPublished: true,
          program: {
            isPublished: true,
          },
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch published courses`);
    }
  },
  ['publishedCourses'],
  {
    revalidate: 24 * 60 * 60 * 1000,
  }
);
