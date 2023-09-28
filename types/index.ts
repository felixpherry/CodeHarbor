import { User, Session } from 'next-auth';

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
