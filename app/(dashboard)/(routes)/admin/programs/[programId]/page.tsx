import IconBadge from '@/components/shared/IconBadge';
import { fetchProgramById } from '@/lib/actions/program.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { LayoutDashboard, ListChecks } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import ProgramNameForm from './_components/ProgramNameForm';
import SubtitleForm from './_components/SubtitleForm';
import DescriptionForm from './_components/DescriptionForm';
import ImageForm from './_components/ImageForm';
import SubprogramsForm from './_components/SubprogramsForm';

const Page = async ({
  params: { programId },
}: {
  params: { programId: string };
}) => {
  const program = await fetchProgramById(programId);
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session?.user || !program) return notFound();

  const requiredFields = [
    program.name,
    program.image,
    program.subtitle1,
    program.subtitle2,
    program.description,
    program.subprograms.some((subprogram) => subprogram.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-2xl font-medium'>Program Setup</h1>

          <span className='text-sm text-slate-700'>
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div>
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={LayoutDashboard} />
            <h2 className='text-xl'>Customize Program</h2>
          </div>

          <ImageForm initialData={program} />
          <ProgramNameForm initialData={program} />
          <SubtitleForm initialData={program} />
          <DescriptionForm initialData={program} />
        </div>
        <div className='space-y-6'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={ListChecks} />
              <h2 className='text-xl'>Subprograms</h2>
            </div>
            <SubprogramsForm initialData={program} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
