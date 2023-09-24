import * as z from 'zod';

export const TrialClassValidation = z.object({
  childName: z.string().nonempty({
    message: 'Nama anak wajib diisi',
  }),
  dateOfBirth: z.date(),
  birthPlace: z.string().nonempty({
    message: 'Tempat lahir anak wajib diisi',
  }),
  childGender: z.enum(['MALE', 'FEMALE'], {
    required_error: 'Jenis kelamin wajib diisi',
  }),
  educationInstitution: z.string().nonempty({
    message: 'Asal sekolah wajib diisi',
  }),
  gradeClass: z.string().nonempty({
    message: 'Kelas wajib diisi',
  }),
  parentName: z.string().nonempty({
    message: 'Nama orang tua wajib diisi',
  }),
  address: z.string().nonempty({
    message: 'Alamat wajib diisi',
  }),
  phoneNumber: z.string().nonempty({
    message: 'No. HP wajib diisi',
  }),
  email: z
    .string()
    .email({
      message: 'Masukkan email yang valid',
    })
    .nonempty(),
  hobby: z.string().nonempty({
    message: 'Hobi wajib diisi',
  }),
  ambition: z.string().nonempty({
    message: 'Cita-cita wajib diisi',
  }),
  trialClassDate: z.date(),
});
