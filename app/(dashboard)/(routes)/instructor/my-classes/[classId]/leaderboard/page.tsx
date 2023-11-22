import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/lib/db';
import Image from 'next/image';

interface PageProps {
  classId: string;
}

const Page = async ({ classId }: PageProps) => {
  const sessionReports = await db.sessionReport.groupBy({
    _sum: {
      score: true,
    },
    _avg: {
      score: true,
    },
    by: ['studentId'],
    orderBy: {
      _sum: {
        score: 'desc',
      },
    },
  });

  const students = await db.student.findMany({
    where: {
      studentCourses: {
        some: {
          classId,
        },
      },
    },
    include: {
      account: true,
    },
  });

  const leaderboard = sessionReports.map(({ _sum, studentId, _avg }) => {
    const student = students.find(({ id }) => id === studentId);

    return {
      name: student!.account.name,
      student: student,
      totalScore: _sum.score,
      avgScore: _avg.score,
    };
  });

  return (
    <div className='p-5 rounded-md shadow bg-white'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-primary'>Rank</TableHead>
              <TableHead className='text-primary'>Name</TableHead>
              <TableHead className='text-primary'>Student ID</TableHead>
              <TableHead className='text-primary'>Total Score</TableHead>
              <TableHead className='text-primary'>Average</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map(({ name, student, totalScore, avgScore }, idx) => (
              <TableRow key={student?.studentId}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <div className='flex gap-5 items-center'>
                    <Image
                      src={student?.account.image || '/avatar-fallback.svg'}
                      alt={student?.account.name || ''}
                      width={25}
                      height={25}
                      className='rounded-full'
                    />
                    <div className='flex flex-col'>
                      <h3 className='text-primary text-sm font-semibold'>
                        {student?.account.name}
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        {student?.account.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='font-semibold'>
                  {student?.studentId}
                </TableCell>
                <TableCell className='font-semibold'>{totalScore}</TableCell>
                <TableCell className='font-semibold'>{avgScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
