'use client';

import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { CourseRegistration } from '@prisma/client';
import moment from 'moment';

interface CourseRegistrationDetailProps {
  data: {
    course: {
      name: string;
    };
    coupon: {
      code: string;
    };
  } & CourseRegistration;
}

const CourseRegistrationDetail = ({ data }: CourseRegistrationDetailProps) => {
  const {
    address,
    birthPlace,
    childGender,
    childName,
    coupon,
    course,
    createdAt,
    dateOfBirth,
    educationInstitution,
    email,
    gradeClass,
    id,
    parentName,
    phoneNumber,
    status,
  } = data;

  const rows = [
    {
      key: 'ID',
      value: id,
    },
    {
      key: 'Course',
      value: course.name,
    },
    {
      key: 'Birth Place',
      value: birthPlace,
    },
    {
      key: 'Date of Birth',
      value: moment(dateOfBirth).format('DD-MM-YYYY'),
    },
    {
      key: 'Gender',
      value: childGender,
    },
    {
      key: 'Grade Class',
      value: gradeClass,
    },
    {
      key: 'Education Institution',
      value: educationInstitution,
    },
    {
      key: 'Email',
      value: email,
    },
    {
      key: 'Phone Number',
      value: phoneNumber,
    },
    {
      key: 'Parent Name',
      value: parentName,
    },
    {
      key: 'Address',
      value: address,
    },
    {
      key: 'Registration Date',
      value: moment(createdAt).format('DD-MM-YYYY'),
    },
  ];

  const statusVariant = status.toLocaleLowerCase() as BadgeProps['variant'];
  return (
    <Dialog>
      <DialogTrigger>
        <span className='hover:underline cursor-pointer text-primary-blue'>
          Details
        </span>
      </DialogTrigger>
      <DialogContent className='p-8'>
        <DialogHeader>
          <DialogTitle>Course Registration Details</DialogTitle>
        </DialogHeader>
        <div className='flex gap-x-5 items-center my-3'>
          <h3 className='font-semibold text-xl'>{childName}</h3>
          <Badge variant={statusVariant}>
            {status[0] + status.substring(1).toLocaleLowerCase()}
          </Badge>
          {coupon?.code && (
            <Badge variant='sky-lighten'>Coupon {coupon.code}</Badge>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          {rows.map(({ key, value }) => (
            <div
              key={key}
              className='flex justify-between text-muted-foreground'
            >
              <span>{key}</span>
              <span className='text-primary font-semibold'>{value}</span>
            </div>
          ))}
        </div>
        <div className='flex justify-end gap-3 mt-3'>
          <DialogClose asChild>
            <Button variant='light' size='sm'>
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseRegistrationDetail;
