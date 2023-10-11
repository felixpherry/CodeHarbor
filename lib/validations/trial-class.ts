import * as z from 'zod';

export const TrialClassValidation = z.object({
  childName: z.string().min(1, {
    message: 'Nama anak wajib diisi',
  }),
  dateOfBirth: z.date(),
  birthPlace: z.string().min(1, {
    message: 'Tempat lahir anak wajib diisi',
  }),
  parentName: z.string().min(1, {
    message: 'Nama orang tua wajib diisi',
  }),
  phoneNumber: z.string().min(1, {
    message: 'No. HP wajib diisi',
  }),
  email: z
    .string()
    .email({
      message: 'Masukkan email yang valid',
    })
    .min(1),
  trialClassDate: z.date(),
  courseId: z.string().min(1, {
    message: 'Kursus wajib dipilih',
  }),
});
