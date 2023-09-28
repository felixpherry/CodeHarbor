import CategoriesForm from '@/app/(dashboard)/_components/CategoriesForm';
import { fetchCategories } from '@/lib/actions/category.actions';

const Page = async () => {
  const categories = await fetchCategories();
  return (
    <div className='w-full px-4 py-20 md:px-10 min-h-[calc(100vh-80px)]'>
      <h1 className='mb-12 text-4xl text-center font-bold tracking-tight leading-none'>
        Categories
      </h1>
      <CategoriesForm categories={categories} />
    </div>
  );
};

export default Page;
