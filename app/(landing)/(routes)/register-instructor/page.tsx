import Image from 'next/image';
import InstructorRegistrationForm from './_components/InstructorRegistrationForm';
import Link from 'next/link';
import { db } from '@/lib/db';

const Page = async () => {
  const skills = await db.skill.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div>
      <div className='bg-gradient-to-l from-[#273575] to-[#004AAD]'>
        <div className='relative container max-w-7xl text-center py-24'>
          <div className='flex flex-col items-center gap-y-2'>
            <h1 className='font-josefin font-bold text-3xl md:text-4xl lg:text-5xl text-white animate-appearance-in'>
              Become an Instructor
            </h1>
            <ul className='flex justify-center items-center gap-3 text-white font-semibold'>
              <li>
                <Link href='/' className='hover:text-primary-yellow'>
                  Home
                </Link>
              </li>
              <li className='bg-white w-[6px] h-[6px] rounded-full'></li>
              <li>Become an Instructor</li>
            </ul>
          </div>
          <Image
            src='/rocket.png'
            height={130}
            width={130}
            alt='rocket'
            className='absolute z-10 bottom-1 left-2 animate-bounce running w-24 h-24 md:w-40 md:h-40'
          />
        </div>
      </div>

      <div className='flex justify-center'>
        <InstructorRegistrationForm skills={skills} />
      </div>
    </div>
  );
};

export default Page;
