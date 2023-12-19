import { User, Session } from 'next-auth';
import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Account, Instructor, Skill, Student } from '@prisma/client';

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface SessionInterface extends Session {
  user: User & {
    id: string;
    name: string;
    email: string;
    image: string;
    role: 'ADMIN' | 'PARENT' | 'INSTRUCTOR' | 'STUDENT';
    status: 'BANNED' | 'ACTIVE';
  };
}

export interface MantineSelectOption {
  label: string;
  value: string;
}

export interface ShadCNOption {
  text: string;
  value: string;
}

export type Status = 'active' | 'inactive' | undefined;

export type AccountWithRoleDetails = {
  student: Student | null;
  instructor:
    | ({
        skills: Skill[];
      } & Instructor)
    | null;
} & Account;
