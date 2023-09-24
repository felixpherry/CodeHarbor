import Link from 'next/link';
import Image from 'next/image';

import ProgramsFilter from './ProgramsFilter';
import { fetchPrograms } from '@/lib/actions/program.actions';
import { fetchCategories } from '@/lib/actions/category.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ProgramDetail } from './ProgramDetail';

interface ProgramCardProps {
  id: string;
  name: string;
  subtitle1: string;
  subtitle2: string;
  image: string;
}

const ProgramCard = ({
  id,
  name,
  subtitle1,
  subtitle2,
  image,
}: ProgramCardProps) => {
  return (
    <Card className='w-full h-full flex justify-between flex-col'>
      <CardHeader className='p-0'>
        <Image
          src={image}
          alt={name}
          width={480}
          height={200}
          className='rounded-tl rounded-tr object-cover h-[180px]'
        />
      </CardHeader>
      <CardContent className='p-6 flex flex-col gap-2'>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{subtitle1}</CardDescription>
        <CardDescription>{subtitle2}</CardDescription>
      </CardContent>
      <CardFooter className='gap-3 px-3'>
        <Button variant='primary-blue' size='sm' className='w-1/2' asChild>
          <Link href={`/register-program-class/${id}`}>Daftar</Link>
        </Button>
        <ProgramDetail id={id} />
      </CardFooter>
    </Card>
  );
};

const Programs = async ({ category }: { category?: string }) => {
  const programs = await fetchPrograms(
    category?.toLocaleLowerCase() === 'all' ? '' : category
  );
  const categories = await fetchCategories();

  return (
    <div id='program' className='bg-light-white w-full pb-20 pt-24 px-10'>
      <ProgramsFilter categories={categories} />
      {programs.length === 0 ? (
        <p className='text-center text-xl'>
          Tidak ada program untuk kategori ini.
        </p>
      ) : (
        <div className='grid justify-center gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4'>
          {programs.map((program, idx) => (
            <div key={idx}>
              <ProgramCard {...program} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Programs;
