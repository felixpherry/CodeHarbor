'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@mantine/core';
import {
  Account,
  Class,
  CourseEvaluation,
  Schedule,
  SessionReport,
  Student,
  StudentCourse,
  StudentScore,
} from '@prisma/client';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface AssessmentTableProps {
  classData: {
    studentCourses: ({
      student: {
        account: Account;
        sessionReports: (SessionReport & { schedule: Schedule })[];
      } & Student;
    } & StudentCourse)[];
    studentScores: StudentScore[];
    _count: {
      schedules: number;
    };
  } & Class;
  evaluationList: CourseEvaluation[];
}

const AssessmentTable = ({
  classData,
  evaluationList,
}: AssessmentTableProps) => {
  const [search, setSearch] = useState('');
  const students = classData.studentCourses.map(({ student }) => student);
  const filteredStudents = students.filter(
    ({ account: { email, name, username } }) =>
      email.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      username?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  const sessionsHeader: string[] = new Array(classData._count.schedules)
    .fill(0)
    .map((_, idx) => `Session ${idx + 1}`);

  const evaluations = evaluationList.filter(
    ({ isSessionReport }) => !isSessionReport
  );
  const sessionReportEvaluation = evaluationList.find(
    ({ isSessionReport }) => isSessionReport
  )!;

  const sessionReports = students.reduce((acc, { id, sessionReports }) => {
    acc[id] = sessionReports;

    return acc;
  }, {} as Record<string, ({ schedule: Schedule } & SessionReport)[]>);

  const findSessionReportScore = (studentId: string, sessionNumber: number) => {
    return (
      sessionReports[studentId]?.find(
        ({ schedule }) => schedule.sessionNumber === sessionNumber
      )?.score || '-'
    );
  };

  const findOtherEvaluationScore = (
    studentId: string,
    evaluationId: string
  ) => {
    return (
      classData.studentScores.find(
        (score) =>
          score.studentId === studentId && score.evaluationId === evaluationId
      )?.score || '-'
    );
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-8 items-center bg-white shadow rounded-sm p-5'>
        <div className='flex gap-[10px] items-center'>
          <p className='text-muted-foreground font-bold'>Students</p>
          <Input
            placeholder='Search students...'
            className='w-60'
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </div>
        <Button
          className='ml-auto'
          size='sm'
          variant='primary-blue'>
          <Plus className='h-4 w-4' />
          Add
        </Button>
      </div>
      <div className='flex gap-8 items-center bg-white shadow rounded-sm p-5'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                rowSpan={2}
                className='text-primary border'>
                No.
              </TableHead>
              <TableHead
                rowSpan={2}
                className='text-primary'>
                Student
              </TableHead>
              {sessionsHeader.map((session) => (
                <TableHead
                  key={session}
                  rowSpan={1}
                  className='text-primary whitespace-nowrap'>
                  {session}
                </TableHead>
              ))}
              {evaluations.map(({ name, id }) => (
                <TableHead
                  key={id}
                  rowSpan={1}
                  className='text-primary whitespace-nowrap'>
                  {name}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              <TableHead
                colSpan={sessionsHeader.length}
                rowSpan={1}
                className='text-primary font-bold whitespace-nowrap text-center'>
                {sessionReportEvaluation.weight}%
              </TableHead>
              {evaluations.map(({ weight, id }) => (
                <TableHead
                  key={id}
                  rowSpan={1}
                  className='text-primary font-bold whitespace-nowrap text-center'>
                  {weight}%
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map(({ id, account }, idx) => (
              <TableRow key={id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <div className='flex gap-5 items-center'>
                    <Image
                      src={account.image || '/avatar-fallback.svg'}
                      alt={account.name || ''}
                      width={25}
                      height={25}
                      className='rounded-full'
                    />
                    <div className='flex flex-col'>
                      <h3 className='text-primary text-sm font-semibold'>
                        {account.name}
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        {account.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                {sessionsHeader.map((_, idx) => (
                  <TableCell key={idx}>
                    {findSessionReportScore(id, idx)}
                  </TableCell>
                ))}
                {evaluations.map((evaluation) => (
                  <TableCell key={evaluation.id}>
                    {findOtherEvaluationScore(id, evaluation.id)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssessmentTable;
