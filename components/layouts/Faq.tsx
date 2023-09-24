'use client';

import { useState, useEffect } from 'react';

import { SessionInterface } from '@/types';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

interface FaqProps {
  type: 'edit' | 'view';
  session: SessionInterface;
  faq: {
    id: string;
    question: string;
    answer: string;
  }[];
}

const Faq = ({ type, session, faq }: FaqProps) => {
  const [form, setForm] = useState(faq);
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

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

  //   const addNewFaq = () => {
  //     setForm((prev) => [
  //       ...prev,
  //       {
  //         question: '',
  //         answer: '',
  //       },
  //     ]);
  //   };

  const deleteFaq = (id: number) => {
    setForm((prev) => prev.filter((item, idx) => idx !== id));
  };

  const handleChange = (
    id: number,
    type: 'question' | 'answer',
    value: string
  ) => {
    handleTextareaResize();

    setForm((prev) =>
      prev.map((item, idx) =>
        idx === id ? { ...item, [type]: value } : { ...item }
      )
    );
  };

  const handleSubmit = async () => {
    // setIsLoading(true);
    // try {
    //   await updateLayout(
    //     'FAQ',
    //     {
    //       faq: form,
    //     },
    //     pathname
    //   );
    //   toast.success('Successfully updated FAQ', {
    //     duration: 6000,
    //   });
    // } catch (error: any) {
    //   toast.error('Failed to update FAQ. Try again later.', {
    //     duration: 6000,
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const isValid =
    !form.some((item) => item.question === '' || item.answer === '') &&
    JSON.stringify(form) !== JSON.stringify(faq);

  if (type === 'edit' && session?.user.role !== 'ADMIN') return null;
  return (
    <div className='bg-light-white w-full px-4 py-20 md:px-10'>
      <h1 className='mb-12 text-4xl text-center font-bold tracking-tight leading-none'>
        FAQ
      </h1>
      <Accordion type='multiple' className='w-full px-10'>
        {form.map(({ question, answer, id }) => (
          <AccordionItem key={id} value={id} className='py-4'>
            <AccordionTrigger className='text-left text-sm font-bold text-slate-600 md:text-lg hover:no-underline'>
              {question}
            </AccordionTrigger>
            <AccordionContent className='text-base'>{answer}</AccordionContent>
          </AccordionItem>

          // <Accordion
          //   key={question}
          //   style={{
          //     paddingTop: '15px',
          //     paddingBottom: '15px',
          //   }}
          // >
          //   <AccordionSummary expandIcon={<ExpandMore />} id={question}>
          //     {type === 'view' ? (
          //       <Typography
          //         fontWeight='bold'
          //         className='text-slate-600 text-sm md:text-lg'
          //       >
          //         {question}
          //       </Typography>
          //     ) : (
          //       <textarea
          //         rows={1}
          //         className='resize-none focus:outline-none w-full bg-white text-slate-600 text-sm md:text-lg font-bold'
          //         value={question}
          //         onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          //           handleChange(idx, 'question', e.target.value)
          //         }
          //         onClick={(e) => e.stopPropagation()}
          //         placeholder='Add your question...'
          //       ></textarea>
          //     )}
          //   </AccordionSummary>
          //   <AccordionDetails>
          //     {type === 'view' ? (
          //       <Typography>{answer}</Typography>
          //     ) : (
          //       <>
          //         <textarea
          //           rows={1}
          //           className='resize-none focus:outline-none w-full bg-white'
          //           value={answer}
          //           onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          //             handleChange(idx, 'answer', e.target.value)
          //           }
          //           placeholder='Add your answer...'
          //         ></textarea>
          //         <button
          //           type='button'
          //           className='flexCenter delete-action_btn bg-red-500 mt-2'
          //           onClick={() => deleteFaq(idx)}
          //         >
          //           <Image src='/trash.svg' width={15} height={15} alt='delete' />
          //         </button>
          //       </>
          //     )}
          //   </AccordionDetails>
          // </Accordion>
        ))}{' '}
      </Accordion>
      {type === 'edit' && (
        <>
          {/* <AddCircleOutlineOutlinedIcon
            onClick={addNewFaq}
            className='text-primary-blue hover:text-blue-900 cursor-pointer mt-6'
            fontSize='large'
          />
          <div className='mt-10 w-full flex gap-1 justify-end'>
            <button
              className='rounded-lg flex items-center justify-center px-3 py-2 gap-3 text-white hover:bg-blue-900 cursor-pointer bg-primary-blue disabled:cursor-not-allowed disabled:bg-blue-900'
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
            >
              {isLoading && <CircularProgress size={14} />}
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div> */}
        </>
      )}
    </div>
  );
};

export default Faq;
