import ActionTooltip from '@/components/shared/ActionTooltip';
import { Button } from '@/components/ui/button';
import { fetchAccountDetail } from '@/lib/actions/account.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { convertToTitleCase } from '@/lib/utils';
import { SessionInterface } from '@/types';
import { CalendarDays, Mail, MapPin, Pencil, Phone } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  const accountDetail = await db.account.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      student: true,
    },
  });

  if (!accountDetail || !accountDetail.student) return notFound();

  const accountDetailMap = [
    {
      label: 'Email',
      value: accountDetail?.email || '-',
      icon: Mail,
    },
    {
      label: 'Phone Number',
      value: accountDetail?.phoneNumber || '-',
      icon: Phone,
    },
    {
      label: 'Address',
      value: accountDetail?.address || '-',
      icon: MapPin,
    },
  ];

  const studentInformationMap = [
    {
      label: 'Student ID',
      value: accountDetail.student.studentId || '-',
    },
    {
      label: 'Date of Birth',
      value:
        moment(accountDetail.student.dateOfBirth).format('DD MMMM YYYY') || '-',
    },
    {
      label: 'Place of Birth',
      value: accountDetail.student.birthPlace,
    },
    {
      label: 'Gender',
      value: convertToTitleCase(accountDetail.student.gender),
    },
    {
      label: 'Grade/Class',
      value: accountDetail.student.gradeClass,
    },
    {
      label: 'Education Institution',
      value: accountDetail.student.educationInstitution,
    },
    {
      label: 'Hobby',
      value: accountDetail.student.hobby || '-',
    },
    {
      label: 'Ambition',
      value: accountDetail.student.ambition || '-',
    },
  ];

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-6 bg-white p-8 rounded-md shadow'>
        <div className='flex flex-col md:flex-row md:justify-between items-start gap-5'>
          <div className='flex flex-col md:flex-row md:items-center gap-5'>
            <Image
              src={session.user.image}
              alt='Profile Photo'
              width={128}
              height={128}
              className='rounded-full h-32 w-32'
            />
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1'>
                <h3 className='font-bold text-2xl'>{accountDetail?.name}</h3>
                <p className='text-base'>
                  {accountDetail?.username ? `@${accountDetail.username}` : '-'}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <CalendarDays className='h-4 w-4' />
                Joined {moment(accountDetail?.createdAt).format('MMMM YYYY')}
              </div>
            </div>
          </div>
          <Button
            variant='edit'
            className='shadow-sm hidden md:flex'
            size='sm'>
            <Pencil className='h-4 w-4' />
            Edit
          </Button>

          <Button
            className='block md:hidden w-full rounded-full font-sans'
            variant='primary-blue-outline'
            size='sm'>
            Edit Profile
          </Button>
        </div>

        <div className='flex items-center gap-x-6 gap-y-3 flex-wrap'>
          {accountDetailMap.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className='flex items-center gap-1'>
              <ActionTooltip label={label}>
                <Icon className='w-4 h-4' />
              </ActionTooltip>
              {value}
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-5 rounded-md shadow bg-white p-5'>
        <h3 className='text-xl font-bold text-primary pb-3 border-b'>
          Student Information
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          {studentInformationMap.map(({ label, value }) => (
            <div
              key={label}
              className='flex flex-col'>
              <h5 className='text-primary font-semibold'>{label}</h5>
              <p className='text-muted-foreground'>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
