import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  if (!session) throw new Error('Unauthorized');

  return {
    userId: session.user.id,
  };
};

export const fileRouter = {
  programImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  courseAttachment: f(['image', 'pdf', 'text', 'video', 'audio'])
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
} satisfies FileRouter;

export type fileRouter = typeof fileRouter;
