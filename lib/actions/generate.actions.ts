'use server';

import { faker } from '@faker-js/faker';
import { db } from '../db';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

export const generateCategories = async () => {
  try {
    return await db.category.createMany({
      data: [
        {
          name: 'Voyager',
          ageDescription: '7-10 Tahun',
        },
        {
          name: 'Analizer',
          ageDescription: '10-14 Tahun',
        },
        {
          name: 'Journeyer',
          ageDescription: '12-17 Tahun',
        },
        {
          name: 'Creators',
          ageDescription: '15-17 Tahun',
        },
      ],
    });
  } catch (error: any) {
    throw new Error(`Failed to generate categories: ${error.message}`);
  }
};

export const generateHero = async () => {
  try {
    await db.hero.deleteMany();
    return await db.hero.create({
      data: {
        title: 'Bangun Potensi Kreativitas Anak-anak Lewat Codings',
        subtitle:
          'Membantu mengembangkan Kreativitas, Karakter, dan Pemikiran Logis Anak-anak Melalui Kursus Coding',
        image:
          'https://res.cloudinary.com/dgtch1ffs/image/upload/v1696243224/yoxqefb9hlos7itwmwtz.png',
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to generate hero: ${error.message}`);
  }
};

export const generateFaq = async () => {
  try {
    return await db.faq.createMany({
      data: [
        {
          question:
            'Apa yang membuat Lecturna berbeda dari kursus koding lainnya?',
          answer:
            'Lecturna mengajarkan konsep dasar koding melalui aktivitas yang menyenangkan seperti game, tantangan, proyek kreatif dan mengajarkan nilai-nilai karakter yang dapat diimplementasikan dalam kehidupan sehari-hari melalui pembelajaran coding.',
        },
        {
          question:
            'Apakah kursus koding Lecturna cocok untuk anak-anak usia berapa?',
          answer:
            'Kursus koding Lecturna ditujukan untuk anak-anak usia 7 hingga 17 tahun, memberikan mereka keunggulan awal dalam proyek koding masa depan mereka.',
        },
        {
          question: 'Apa yang dijadikan fokus dalam kursus koding Lecturna?',
          answer:
            'Kursus koding Lecturna fokus pada pembuatan website, pengembangan aplikasi mobile, dan pengembangan game.',
        },
        {
          question:
            'Apakah diperlukan pengetahuan koding sebelumnya untuk mengikuti kursus Lecturna?',
          answer:
            'Tidak, kursus koding Lecturna dirancang untuk semua tingkatan pemula. Kami menyediakan pembelajaran yang disesuaikan dengan level pemahaman anak-anak, sehingga tidak diperlukan pengetahuan koding sebelumnya.',
        },
      ],
    });
  } catch (error: any) {
    throw new Error(`Failed to generate FAQ: ${error.message}`);
  }
};

export const generateLogo = async () => {
  try {
    await db.logo.deleteMany();
    return await db.logo.create({
      data: {
        image:
          'https://res.cloudinary.com/dgtch1ffs/image/upload/v1696243248/fx7rxn5qmwes2cs02qo3.webp',
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to generate logo: ${error.message}`);
  }
};

export const generateUser = async () => {
  try {
    const adminPassword = await bcrypt.hash('admin', 10);
    const instructorPassword = await bcrypt.hash('instructor', 10);
    const parentPassword = await bcrypt.hash('parent', 10);
    const studentPassword = await bcrypt.hash('student', 10);

    const admin = await db.account.create({
      data: {
        email: 'admin@gmail.com',
        password: adminPassword,
        name: 'admin',
        phoneNumber: '123123',
        role: 'ADMIN',
        address: 'address123',
        username: 'admin',
        admin: {
          create: {},
        },
      },
    });

    const instructor = await db.account.create({
      data: {
        email: 'instructor@gmail.com',
        password: instructorPassword,
        name: 'instructor',
        phoneNumber: '123456',
        role: 'INSTRUCTOR',
        address: 'address123',
        username: 'instructor',
        instructor: {
          create: {
            dateOfBirth: new Date('04-04-1990'),
            lastEducation: 'S1',
            educationInstitution: 'Binus',
            skills: {
              create: {
                name: 'Programming',
              },
            },
          },
        },
      },
    });

    const parent = await db.account.create({
      data: {
        email: 'parent@gmail.com',
        password: parentPassword,
        name: 'parent',
        phoneNumber: '123321',
        role: 'PARENT',
        address: 'address123',
        username: 'parent',
        parent: {
          create: {},
        },
      },
    });

    const student = await db.account.create({
      data: {
        email: 'student@gmail.com',
        password: studentPassword,
        name: 'student',
        phoneNumber: '0901221',
        role: 'STUDENT',
        address: 'address123',
        username: 'student',
      },
    });

    return {
      admin,
      parent,
      instructor,
      student,
    };
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to generate user: ${error.message}`);
  }
};

export const seedData = async () => {
  try {
    await generateCategories();
    await generateHero();
    await generateFaq();
    await generateLogo();
    await generateUser();
  } catch (error: any) {
    throw new Error(`Failed to seed data: ${error.message}`);
  }
};

// export const generatePrograms = async () => {
//   try {
//     await db.program.createMany({
//       data: [
//         {
//           name: 'Web Programming',
//           subtitle: 'Web (Beginner, Intermediate, Advanced)',
//           description:
//             'Terjunlah ke dunia menarik pengembangan web dengan program Pemrograman Web yang komprehensif kami. Baik Anda pemula, menengah, maupun mahir, program ini menawarkan kurikulum progresif yang memperlengkapi Anda dengan keterampilan untuk merancang dan mengembangkan situs web yang menakjubkan. Mulai dari HTML dan CSS hingga JavaScript dan kerangka kerja backend, temukan rahasia dari lanskap digital dan ungkapkan kreativitas Anda dalam dunia web yang terus berkembang. Daftar Sekarang.',
//           image:
//             'https://res.cloudinary.com/dgtch1ffs/image/upload/v1689776273/eezfvctdcefxczrikpzd.jpg',
//           userId: '79f208bf-dbcf-40d7-9873-bab3258031ae',
//         },
//         {
//           name: 'Mobile Programming',
//           subtitle: 'MiT Inventor App',
//           description:
//             'Mulailah perjalanan seru ke dunia pengembangan aplikasi seluler dengan program Pemrograman Mobile kami. Dengan menggunakan aplikasi MiT Inventor yang terkenal, Anda akan menemukan seni menciptakan aplikasi seluler yang inovatif dan menarik. Mulai dari merancang antarmuka pengguna hingga membuat fitur interaktif, program ini memberdayakan Anda untuk mewujudkan ide-ide Anda di dalam genggaman tangan. Temukan potensi teknologi seluler dan menjadi pendorong perubahan di era digital.',
//           image:
//             'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.qulix.com%2Fwp-content%2Fuploads%2F2020%2F05%2FArtboard-612101101.jpg&f=1&nofb=1&ipt=cbeae9b094030b03ec4511604b1114ca63283d8339c30010fa6ecccfb5e6b396&ipo=images',
//           userId: '79f208bf-dbcf-40d7-9873-bab3258031ae',
//         },
//         {
//           name: 'Text Programming',
//           subtitle: 'Text Programming (Roblox)',
//           description:
//             'Masuki dunia pemrograman berbasis teks dengan program menarik kami, yang berpusat pada platform populer Roblox. Lepaskan imajinasi Anda dan bangun dunia maya yang mendalam, permainan interaktif, dan pengalaman menarik. Mulai dari mengkodekan mekanika dan menciptakan lingkungan yang dinamis hingga membuat skrip permainan yang rumit, program ini memberikan pondasi yang kokoh bagi para pengembang game dan para pencerita digital yang berbakat.',
//           image:
//             'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgamelevate.com%2Fwp-content%2Fuploads%2F2023%2F07%2FRoblox_-_Featured_Image.jpg&f=1&nofb=1&ipt=699128b6ef34850411f056aada4b5cbd91f48496049df6c49d611321ede955b0&ipo=images',
//           userId: '79f208bf-dbcf-40d7-9873-bab3258031ae',
//         },
//         {
//           name: 'Visual Programming',
//           subtitle: 'Visual Programming (Scratch)',
//           description:
//             'Kenalkan anak-anak pada keajaiban pemrograman dengan program Pemrograman Visual kami, yang menampilkan platform terkenal bernama Scratch. Melalui antarmuka yang ramah pengguna dan intuitif, anak-anak akan belajar dasar-dasar pemrograman sambil membuat cerita interaktif, animasi, dan permainan. Mulai dari menarik dan menjatuhkan blok-blok kode hingga berpikir logis, program ini membangun keterampilan berpikir komputasional dan menyalakan semangat mereka dalam teknologi seumur hidup.',
//           image:
//             'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmlyj654c2n0p.i.optimole.com%2Fr3qBotM-nKTTY9HB%2Fw%3Aauto%2Fh%3Aauto%2Fq%3Aauto%2Fhttp%3A%2F%2Fwww.drcodie.com%2Fwp-content%2Fuploads%2F2020%2F06%2Fscratch.jpg&f=1&nofb=1&ipt=413461b6757500f09b0601c3ee72dbaee58d35688032048f76560d9fc9ea4484&ipo=images',
//           userId: '79f208bf-dbcf-40d7-9873-bab3258031ae',
//         },
//       ],
//     });
//   } catch (error: any) {
//     throw new Error(`Failed to generate program data: ${error.message}`);
//   }
// };

export const generateTrialClassData = async () => {
  try {
    const data: Prisma.TrialClassRegistrationCreateManyInput[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        parentName: faker.person.fullName(),
        childName: faker.person.fullName(),

        birthPlace: faker.location.city(),

        dateOfBirth: faker.date.birthdate(),

        email: faker.internet.email(),
        courseId: 'clnmxyuqb0000jo080zj5tbx7',
        phoneNumber: faker.phone.number(),
        trialClassDate: faker.date.future(),
      });
    }
    await db.trialClassRegistration.createMany({
      data,
    });
  } catch (error: any) {
    throw new Error(`Failed to generate trial class data: ${error.message}`);
  }
};

export const generateCourseRegistrationData = async () => {
  try {
    const data: Prisma.CourseRegistrationCreateManyInput[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        parentName: faker.person.fullName(),
        childName: faker.person.fullName(),

        birthPlace: faker.location.city(),

        dateOfBirth: faker.date.birthdate(),

        childEmail: faker.internet.email(),
        parentEmail: faker.internet.email(),
        courseId: '15728267-2af7-447b-9f77-fe020cb6c14a',
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        childGender: 'FEMALE',
        educationInstitution: faker.company.name(),
        gradeClass: '12',
        couponId: 'clnnbnixk0000ui80uu7ipma3',
      });
    }
    await db.courseRegistration.createMany({
      data,
    });
  } catch (error: any) {
    throw new Error(
      `Failed to generate course registration data: ${error.message}`
    );
  }
};

export const generateInstructorRegistrationData = async () => {
  try {
    // const data: Prisma.InstructorRegistrationCreateInput[] = [];
    for (let i = 0; i < 100; i++) {
      const data: Prisma.InstructorRegistrationCreateInput = {
        name: faker.person.fullName(),
        lastEducation: 'S1',
        dateOfBirth: faker.date.birthdate(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        educationInstitution: faker.company.name(),
        // skills: {
        //   connect: {
        //     id: 'clnobz0jj0002ui2o0k9egwou',
        //   },
        // },
        skills: {
          connect: {
            id: 'clnobz0jj0002ui2o0k9egwou',
          },
        },
      };
      await db.instructorRegistration.create({
        data,
      });
    }
  } catch (error: any) {
    throw new Error(
      `Failed to generate course registration data: ${error.message}`
    );
  }
};
