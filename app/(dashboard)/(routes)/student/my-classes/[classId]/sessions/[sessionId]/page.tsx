import Preview from '@/components/shared/Preview';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { File, Presentation, Video } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    classId: string;
    sessionId: string;
  };
}

const Page = async ({ params: { classId, sessionId } }: PageProps) => {
  const classData = await db.class.findUnique({
    where: {
      id: classId,
    },
    include: {
      course: true,
      schedules: true,
    },
  });
  const scheduleData = await db.schedule.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      otherAttachments: true,
    },
  });

  if (!classData || !scheduleData) return notFound();

  const sessionData = await db.session.findFirst({
    where: {
      sessionNumber: scheduleData.sessionNumber,
      courseId: classData.courseId,
    },
    include: {
      attachments: true,
    },
  });

  if (!sessionData) return notFound();

  return (
    <>
      <div className='w-full bg-white shadow-lg rounded-md p-4'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4'>
            <div className='w-full pb-3 border-b-2 border-b-secondary'>
              <h3 className='text-muted-foreground text-base'>Sessions</h3>
            </div>
          </div>
          <div className='w-full'>
            <div className='overflow-x-auto flex gap-2'>
              {classData.schedules.map((schedule) => (
                <Link
                  key={schedule.id}
                  href={`/student/my-classes/${classId}/sessions/${schedule.id}`}
                  className={cn(
                    'text-primary whitespace-nowrap cursor-pointer p-3 rounded-md',
                    sessionId === schedule.id
                      ? 'bg-primary-blue text-white font-semibold'
                      : 'hover:bg-sky-200/20'
                  )}
                >
                  Session {schedule.sessionNumber}
                </Link>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-12 px-5 pb-5 gap-5'>
            <div className='col-span-12 md:col-span-7'>
              <div className='flex flex-col gap-5 border-b-secondary border-b-2'>
                <h3 className='text-xl text-primary'>{sessionData.main}</h3>
                <div className='flex flex-col'>
                  <p className='font-bold'>Description</p>
                  <Preview
                    value={sessionData.description || ''}
                    className='[&_.ql-editor]:px-0 [&_.ql-editor_ul]:pl-0'
                  />
                </div>
              </div>
              <div className='flex flex-col gap-5 pt-5'>
                <div className='flex flex-col gap-1'>
                  <p className='text-base text-muted-foreground'>Start</p>
                  <p className='text-lg text-primary'>
                    {moment(scheduleData.scheduleDate).format('DD MMMM YYYY')},
                    {scheduleData.scheduleTime.split(' - ')[0]}
                  </p>
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-base text-muted-foreground'>End</p>
                  <p className='text-lg text-primary'>
                    {moment(scheduleData.scheduleDate).format('DD MMMM YYYY')},
                    {scheduleData.scheduleTime.split(' - ')[1]}
                  </p>
                </div>
              </div>
            </div>
            <div className='col-span-12 md:col-span-5'>
              <div className='p-5 bg-gradient-to-t from-[#273575] to-[#004AAD] rounded-md text-white'>
                <div className='flex flex-col gap-5'>
                  <h4 className='text-base font-normal'>
                    Resources
                  </h4>
                  <div className='flex flex-col gap-1 w-full'>
                    <a
                      href={scheduleData.meetingUrl || ''}
                      target='_blank'
                      className='flex items-center gap-3 p-3 rounded-md hover:bg-sky-200/20'
                    >
                      <Presentation className='h-4 w-4' />
                      <span>Meeting URL</span>
                    </a>
                    <a
                      href={scheduleData.recordingUrl || ''}
                      target='_blank'
                      className='flex items-center gap-3 p-3 rounded-md hover:bg-sky-200/20'
                    >
                      <Video className='h-4 w-4' />
                      <span>Recording URL</span>
                    </a>
                    {sessionData.attachments.map(
                      ({ id, filename, fileUrl }) => (
                        <a
                          key={id}
                          href={fileUrl}
                          target='_blank'
                          className='flex items-center gap-3 p-3 rounded-md hover:bg-sky-200/20'
                        >
                          <File className='h-4 w-4' />
                          <span>{filename}</span>
                        </a>
                      )
                    )}
                    {scheduleData.otherAttachments.map(
                      ({ id, name, fileUrl }) => (
                        <a
                          key={id}
                          href={fileUrl}
                          target='_blank'
                          className='flex items-center gap-3 p-3 rounded-md hover:bg-sky-200/20'
                        >
                          <File className='h-4 w-4' />
                          <span>{name}</span>
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <h3>{sessionData.reference}</h3>

          <h3>{moment(scheduleData.scheduleDate).format('DD MMMM YYYY')}</h3>
          <h3>{scheduleData.scheduleTime}</h3>
          <a
            href={scheduleData.meetingUrl || ''}
            target='_blank'
            className='text-primary-blue hover:underline'
          >
            {scheduleData.meetingUrl}
          </a>
          <a
            href={scheduleData.meetingUrl || ''}
            target='_blank'
            className='text-primary-blue hover:underline'
          >
            {scheduleData.recordingUrl}
          </a> */}
        </div>
      </div>
    </>
  );
};

export default Page;
