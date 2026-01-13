'use client';

import {  login } from '@/app/_lib/actions';

import { useRouter } from 'next/navigation';

import { toast } from 'react-hot-toast';
import LoginFormComp from './LoginFormComp';
import { useTransition } from 'react';




export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      try {
        const role = await login(formData);
        toast.success('Signin successful! Redirecting...', {
          duration: 4000,
          style: {
            background: '#041527',
            color: '#fff',
          },
        });

        setTimeout(() => {
          if (role === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/account');
          }
        }, 1000);
      } catch (error) {
        toast.error(`The email or password you entered is incorrect.`, {
          duration: 10000,
          style: {
            background: '#041527',
            color: '#fff',
          },
        });
      }
    });
  };

  return (
    <main className="w-[90%] max-w-[500px] mx-auto py-6 text-[#041527]">
     <LoginFormComp handleSubmit={handleSubmit}
     isPending={isPending}/>
     
    </main>
  );
}
