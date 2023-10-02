import { getCurrentUser } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, ListTodo } from 'lucide-react';
import IconBadge from '@/components/shared/IconBadge';
import SubprogramNameForm from './_components/SubprogramNameForm';
import SubprogramDescriptionForm from './_components/SubprogramDescriptionForm';
import SubprogramCategory from './_components/SubprogramCategoryForm';
import { fetchCategories } from '@/lib/actions/category.actions';
import SessionsForm from './_components/SessionsForm';
import { fetchSubprogramById } from '@/lib/actions/program.actions';

const Page = async ({
  params: { programId, subprogramId },
}: {
  params: {
    programId: string;
    subprogramId: string;
  };
}) => {
  const session = await getCurrentUser();
  if (!session) return redirect('/');

  const subprogram = await fetchSubprogramById({ subprogramId, programId });

  if (!subprogram) return notFound();

  const categories = await fetchCategories();

  const options = categories.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const requiredFields = [
    subprogram.name,
    subprogram.description,
    subprogram.categoryId,
    subprogram.sessions.some((session) => session.isPublished),
  ];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='w-full'>
          <Link
            href={`/admin/programs/${programId}`}
            className='flex items-center text-sm hover:opacity-75 transition mb-6'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Link>
          <div className='flex items-center justify-between w-full'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-medium'>Create Subprogram</h1>
              <span className='text-sm text-slate-700'>
                Complete all fields {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div className='space-y-4'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={LayoutDashboard} />
              <h2 className='text-xl'>Customize subprogram</h2>
            </div>
            <SubprogramNameForm initialData={subprogram} />
            <SubprogramDescriptionForm initialData={subprogram} />
            <SubprogramCategory initialData={subprogram} options={options} />
          </div>
        </div>
        <div className='space-y-6'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={ListTodo} />
              <h2 className='text-xl'>Sessions</h2>
            </div>
            <SessionsForm initialData={subprogram} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
