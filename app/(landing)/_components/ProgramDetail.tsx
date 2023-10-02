import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchProgramDetail } from '@/lib/actions/program.actions';
import Image from 'next/image';

export const ProgramDetail = async ({ id }: { id: string }) => {
  const program = await fetchProgramDetail(id);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='primary-blue-outline' size='sm' className='w-1/2'>
          Lihat Detail
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[425px] md:w-[550px] lg:w-[675px] overflow-y-scroll max-h-screen'>
        <DialogHeader>
          <DialogTitle>{program?.name}</DialogTitle>
          <DialogDescription>{program?.subtitle}</DialogDescription>
        </DialogHeader>
        <Image
          src={program?.image || ''}
          alt={program?.name || 'Program Detail'}
          height={200}
          width={400}
          className='w-full text-center'
        />
        <p>{program?.description}</p>
        <p>{program?.description}</p>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetail;
