'use client';

import Carousel, { ResponsiveType } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { ArrowRight, ArrowLeft } from 'lucide-react';

import { testimonials } from '@/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';

import { Rating } from '@smastrom/react-rating';
import { Button } from '../../../components/ui/button';

const ButtonGroup = ({
  next,
  previous,
}: {
  next?: () => void;
  previous?: () => void;
}) => {
  return (
    <div className='flex justify-end gap-3 mt-10 mr-10'>
      <Button
        variant='primary-blue'
        className='rounded-full p-3'
        onClick={previous}
      >
        <ArrowLeft />
      </Button>
      <Button
        variant='primary-blue'
        className='rounded-full p-3'
        onClick={next}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

const responsive: ResponsiveType = {
  0: {
    breakpoint: { max: 2048, min: 1024 },
    items: 2,
    slidesToSlide: 2,
  },
  1: {
    breakpoint: { max: 768, min: 1024 },
    items: 2,
    slidesToSlide: 2,
  },
  2: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

// const responsive: ResponsiveType = {
//   0: {
//     breakpoint: { max: 1800, min: 1280 },
//     items: 3,
//     slidesToSlide: 3,
//   },
//   1: {
//     breakpoint: { max: 1280, min: 1248 },
//     items: 2,
//     slidesToSlide: 2,
//     partialVisibilityGutter: 80,
//   },
//   2: {
//     breakpoint: { max: 1248, min: 1216 },
//     items: 2,
//     slidesToSlide: 2,
//     partialVisibilityGutter: 48,
//   },
//   3: {
//     breakpoint: { max: 1216, min: 1200 },
//     items: 2,
//     slidesToSlide: 2,
//     partialVisibilityGutter: 16,
//   },
//   4: {
//     breakpoint: { max: 1200, min: 1072 },
//     items: 2,
//     slidesToSlide: 2,
//     partialVisibilityGutter: 0,
//   },
//   5: {
//     breakpoint: { max: 1072, min: 1040 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 448,
//   },
//   6: {
//     breakpoint: { max: 1040, min: 1000 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 416,
//   },
//   7: {
//     breakpoint: { max: 1000, min: 968 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 384,
//   },
//   8: {
//     breakpoint: { max: 968, min: 932 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 352,
//   },
//   9: {
//     breakpoint: { max: 932, min: 900 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 320,
//   },
//   '10': {
//     breakpoint: { max: 900, min: 868 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 288,
//   },
//   '11': {
//     breakpoint: { max: 868, min: 832 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 252,
//   },
//   '12': {
//     breakpoint: { max: 832, min: 800 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 220,
//   },
//   '13': {
//     breakpoint: { max: 832, min: 768 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 188,
//   },
//   '14': {
//     breakpoint: { max: 768, min: 700 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 270,
//   },
//   '15': {
//     breakpoint: { max: 700, min: 650 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 220,
//   },
//   '16': {
//     breakpoint: { max: 650, min: 600 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 170,
//   },
//   '17': {
//     breakpoint: { max: 600, min: 550 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 110,
//   },
//   '18': {
//     breakpoint: { max: 550, min: 480 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 50,
//   },
//   '19': {
//     breakpoint: { max: 480, min: 0 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 0,
//   },
// };

const Testimonials = () => {
  return (
    <div className='bg-white w-full py-20 px-10'>
      <h1 className='mb-20 text-4xl text-center font-bold tracking-tight leading-none'>
        Testimonial
      </h1>
      <div className='container max-w-7xl'>
        <Carousel
          responsive={responsive}
          infinite={true}
          partialVisible={true}
          customButtonGroup={<ButtonGroup />}
          renderButtonGroupOutside={true}
          arrows={false}
          ssr={true}
        >
          {testimonials.map(({ name, content, rating }) => (
            <Card
              key={name}
              className='w-full h-full max-w-[330px] md:max-w-[480px] shadow-lg rounded-xl border-2 border-light-white-500 mx-4 my-auto flex justify-between flex-col p-10'
            >
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                  <Rating style={{ maxWidth: 100 }} value={rating} readOnly />
                </CardDescription>
              </CardHeader>
              <CardContent className='text-xl font-semibold'>
                &quot;{content}&quot;
              </CardContent>
            </Card>
            // <Card
            //   key={name}
            //   className='w-full h-full max-w-[330px] md:max-w-[480px] shadow-lg rounded-xl border-2 border-light-white-500 mx-4 my-auto flex justify-between flex-col p-10'
            // >
            //   <CardContent>
            //     <Typography
            //       variant='body2'
            //       color='black'
            //       className='text-base md:text-[22px] font-bold'
            //     >
            //       "{content}"
            //     </Typography>
            //   </CardContent>
            //   <div className='p-3'>
            //     <Typography
            //       gutterBottom
            //       variant='h5'
            //       component='div'
            //       className='text-base md:text-[22px] font-bold'
            //     >
            //       {name}
            //     </Typography>
            //     <Rating value={rating} precision={0.5} readOnly />
            //   </div>
            // </Card>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonials;
