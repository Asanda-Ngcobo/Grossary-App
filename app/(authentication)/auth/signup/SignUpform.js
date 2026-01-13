

'use client';

import { signUpUser } from '@/app/_lib/actions';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'react-hot-toast';
import SignUpFormComp from './SignUpFormComp';
import AppPreview from './AppPreview';


export default function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      try {
         await signUpUser(formData);

        router.push('/auth/signup-success')

      } catch (error) {
        toast.error('An error occured when signing up, Please try again!!', {
  duration: 4000,
  style: {
    background: '#041527',
    color: '#fff',
  },
});
      }
    });
  };

  return (
    <main className="lg:grid lg:grid-cols-[1fr_2fr]
     h-screen">
<SignUpFormComp handleSubmit={handleSubmit}
isPending={isPending}/>

    <AppPreview/>
    </main>
   
  );
}
