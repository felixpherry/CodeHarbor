'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { updateCategories } from '@/lib/actions/category.actions';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface CategoryInterface {
  id: string;
  name: string;
}

interface CategoriesFormProps {
  categories: CategoryInterface[];
}

const CategoriesForm = ({ categories }: CategoriesFormProps) => {
  const [form, setForm] = useState(categories);
  const [deletedIds, setDeletedIds] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const { toast } = useToast();

  const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) =>
      prev.map((item) => {
        if (id === item.id) {
          return {
            ...item,
            [e.target.name]: e.target.value,
          };
        }
        return item;
      })
    );
  };

  const addNewCategory = () => {
    setForm((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: '',
      },
    ]);
  };

  const deleteCategory = (id: string) => {
    setForm((prev) => prev.filter((item) => item.id !== id));
    if (id.length === 36) setDeletedIds([...deletedIds, id]);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const newCategories = form.filter((item) => item.id.length !== 36);
      const updatedCategories = form.filter((item) => item.id.length === 36);
      await updateCategories(
        newCategories,
        updatedCategories,
        deletedIds,
        pathname
      );
      toast({
        description: 'Successfully updated categories',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    form.every((item) => item.name !== '') &&
    JSON.stringify(form) !== JSON.stringify(categories);

  return (
    <>
      <div className='flex justify-center items-center px-52'>
        <Table>
          <TableCaption className='mt-10'>
            <PlusCircle
              className='text-primary-500 hover:text-primary-400 cursor-pointer'
              onClick={addNewCategory}
            />
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.map(({ id, name }) => (
              <TableRow key={id}>
                <TableCell>
                  <input
                    value={name}
                    name='name'
                    onChange={(e) => handleChange(id, e)}
                    placeholder='Enter category name...'
                    className='focus:outline-none bg-inherit'
                  />
                </TableCell>
                <TableCell onClick={() => deleteCategory(id)}>
                  <Trash2 className='cursor-pointer text-red-500 hover:text-red-600 mx-auto' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='w-full px-10 flex justify-end mt-10'>
        <Button
          variant='primary-blue'
          size='sm'
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
        >
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Save
        </Button>
      </div>
    </>
  );
};

export default CategoriesForm;
