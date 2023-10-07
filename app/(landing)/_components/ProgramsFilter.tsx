'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../../components/ui/button';

type Props = {
  categories: Array<
    Required<{
      id: string;
      name: string;
      ageDescription: string;
    }>
  >;
};

const Chip = ({
  label,
  handleClick,
  active,
}: {
  label: string;
  handleClick: () => void;
  active: boolean;
}) => {
  return (
    <Button
      onClick={handleClick}
      variant={active ? 'primary-blue' : 'primary-blue-outline'}
      className='rounded-full font-semibold uppercase h-[46px]'
    >
      {label}
    </Button>
  );
};

const ProgramsFilter = ({ categories }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const clearCategory = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <div className='relative pt-6 lg:pt-10 px-5 lg:px-[60px] border-gray-50 rounded-3xl border-[1px] mb-14'>
      <h1 className='text-4xl absolute -left-10 lg:left-[50%] -top-8 z-10 lg:translate-x-[-50%] px-10 pb-4 bg-light-white font-bold tracking-tight leading-none'>
        Program Lecturna
      </h1>
      <div className='flex justify-start lg:justify-center items-center gap-4 flex-wrap mb-6'>
        <Chip
          label='Semua Kategori'
          handleClick={clearCategory}
          active={!searchParams.get('category')}
        />
        {categories.map(({ ageDescription, id }) => (
          <Chip
            key={id}
            label={ageDescription}
            handleClick={() =>
              router.push(`?category=${id}`, {
                scroll: false,
              })
            }
            active={
              searchParams.get('category')?.toLocaleLowerCase() ===
              id?.toLocaleLowerCase()
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ProgramsFilter;
