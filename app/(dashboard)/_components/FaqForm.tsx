'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { updateFaq } from '@/lib/actions/faq.actions';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FaqInterface {
  id: string;
  question: string;
  answer: string;
}

interface FaqFormProps {
  faq: FaqInterface[];
}

const FaqForm = ({ faq }: FaqFormProps) => {
  const [form, setForm] = useState<FaqInterface[]>(faq);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    handleTextareaResize();
    window.addEventListener('resize', handleTextareaResize);

    return () => {
      window.removeEventListener('resize', handleTextareaResize);
    };
  }, []);

  const handleTextareaResize = () => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  };

  const addNewQuestion = () => {
    setForm((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        question: '',
        answer: '',
      },
    ]);
  };

  const deleteFaq = (id: string) => {
    setForm((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await updateFaq(form, pathname);
      toast.success('Successfully updated FAQ');
    } catch (error: any) {
      toast.message(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    form.every((item) => item.answer !== '' && item.question !== '') &&
    JSON.stringify(form) !== JSON.stringify(faq);

  return (
    <div className='bg-light-white w-full px-4 py-20 md:px-10 min-h-[calc(100vh-80px)]'>
      <h1 className='mb-12 text-4xl text-center font-bold tracking-tight leading-none'>
        Frequently Asked Questions
      </h1>
      <Accordion type='multiple' className='w-full px-10'>
        {form.map(({ question, answer, id }) => (
          <AccordionItem key={id} value={id} className='py-4'>
            <AccordionTrigger className='text-left text-sm font-bold text-slate-600 md:text-lg hover:no-underline'>
              <textarea
                name='question'
                value={question}
                className='focus:outline-none resize-none bg-inherit w-full'
                onChange={(e) => handleChange(id, e)}
                placeholder='Add your question...'
                required
              ></textarea>
            </AccordionTrigger>
            <AccordionContent className='text-base'>
              <textarea
                name='answer'
                value={answer}
                className='focus:outline-none resize-none bg-inherit w-full'
                onChange={(e) => handleChange(id, e)}
                placeholder='Add your answer...'
                required
              ></textarea>
              <Trash2
                className='text-red-500 hover:text-red-600 mt-5 cursor-pointer'
                onClick={() => deleteFaq(id)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <PlusCircle
        className='text-primary-500 hover:text-primary-400 cursor-pointer w-8 h-8 mx-auto mt-10'
        onClick={addNewQuestion}
      />
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
    </div>
  );
};

export default FaqForm;
