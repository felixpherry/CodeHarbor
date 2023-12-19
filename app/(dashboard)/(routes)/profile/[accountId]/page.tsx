import ActionTooltip from '@/components/shared/ActionTooltip';
import BackButton from '@/components/shared/BackButton';
import { Button } from '@/components/ui/button';
import { getCurrentPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { convertToTitleCase } from '@/lib/utils';
import { SessionInterface } from '@/types';
import {
  BadgeCheck,
  CalendarDays,
  File,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  params: {
    accountId: string;
  };
}

const Page = async ({ params: { accountId } }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  const currentPeriod = await getCurrentPeriod();

  const accountDetail = await db.account.findUnique({
    where: {
      id: accountId,
    },
    include: {
      student: {
        include: {
          studentCourses: {
            include: {
              course: true,
            },
          },
        },
      },
      instructor: {
        include: {
          instructorSchedules: {
            include: {
              day: true,
              shift: true,
              period: true,
            },
            where: {
              periodId: currentPeriod?.id,
            },
          },
          instructorCourses: true,
          skills: true,
        },
      },
      parent: {
        include: {
          children: {
            include: {
              account: true,
            },
          },
        },
      },
    },
  });

  if (!accountDetail) return notFound();
  const isOwner = session.user.id === accountDetail.id;

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

  const studentInformationMap = accountDetail.student
    ? [
        {
          label: 'Student ID',
          value: accountDetail?.student?.studentId || '-',
        },
        {
          label: 'Date of Birth',
          value:
            moment(accountDetail?.student?.dateOfBirth).format(
              'DD MMMM YYYY'
            ) || '-',
        },
        {
          label: 'Place of Birth',
          value: accountDetail?.student?.birthPlace,
        },
        {
          label: 'Gender',
          value: convertToTitleCase(accountDetail?.student?.gender || ''),
        },
        {
          label: 'Grade/Class',
          value: accountDetail?.student?.gradeClass,
        },
        {
          label: 'Education Institution',
          value: accountDetail?.student?.educationInstitution,
        },
        {
          label: 'Hobby',
          value: accountDetail?.student?.hobby || '-',
        },
        {
          label: 'Ambition',
          value: accountDetail?.student?.ambition || '-',
        },
      ]
    : null;

  const instructorInformationMap = accountDetail.instructor
    ? [
        {
          label: 'Date of Birth',
          value:
            moment(accountDetail?.student?.dateOfBirth).format(
              'DD MMMM YYYY'
            ) || '-',
        },
        {
          label: 'Last Education',
          value: accountDetail.instructor.lastEducation || '-',
        },
        {
          label: 'Education Institution',
          value: accountDetail.instructor.educationInstitution || '-',
        },
        {
          label: 'ID Card',
          href: accountDetail.instructor.fileIDCard || null,
        },
        {
          label: 'NPWP',
          href: accountDetail.instructor.fileNPWP || null,
        },
      ]
    : null;

  // TODO
  // Instructor perlu kasih liat schedule dan skillnya
  // Parent perlu kasih liat childrennya

  return (
    <div className='flex flex-col gap-5'>
      <BackButton />
      <div className='flex flex-col gap-6 bg-white p-8 rounded-md shadow'>
        <div className='flex flex-col md:flex-row md:justify-between items-start gap-5'>
          <div className='flex flex-col md:flex-row md:items-center gap-5'>
            <Image
              src={accountDetail.image || '/avatar-fallback.svg'}
              alt='Profile Photo'
              width={128}
              height={128}
              className='rounded-full h-32 w-32'
            />
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1'>
                <h3 className='font-bold text-2xl flex items-center gap-2'>
                  {accountDetail?.name}{' '}
                  {accountDetail.onboarded && (
                    <ActionTooltip label='Onboarded'>
                      <BadgeCheck className='text-emerald-400 h-6 w-6' />
                    </ActionTooltip>
                  )}
                </h3>
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
          {isOwner && (
            <>
              <Button
                variant='edit'
                className='shadow-sm hidden md:flex'
                size='sm'
                asChild>
                <Link href={`/profile/${session.user.id}/edit`}>
                  <Pencil className='h-4 w-4' />
                  Edit
                </Link>
              </Button>

              <Button
                className='block md:hidden w-full rounded-full font-sans'
                variant='primary-blue-outline'
                size='sm'>
                <Link href={`/profile/${session.user.id}/edit`}>
                  Edit Profile
                </Link>
              </Button>
            </>
          )}
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
      {studentInformationMap && (
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
      )}
      {instructorInformationMap && (
        <div className='flex flex-col gap-5 rounded-md shadow bg-white p-5'>
          <h3 className='text-xl font-bold text-primary pb-3 border-b'>
            Instructor Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            {instructorInformationMap.map(({ label, href, value }) => (
              <div
                key={label}
                className='flex flex-col'>
                <h5 className='text-primary font-semibold'>{label}</h5>
                {href ? (
                  <a
                    className='flex items-center gap-1 text-primary-blue hover:underline font-medium'
                    href={href}
                    target='_blank'>
                    <File className='h-4 w-4' /> File {label}
                  </a>
                ) : (
                  <p className='text-muted-foreground'>{value || '-'}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
