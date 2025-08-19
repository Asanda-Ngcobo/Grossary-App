'use client';

import Logo from "@/app/(website)/_components/Logo";
import { ResetPasswordWithEmail } from "@/app/_lib/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

function Page() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const { success, error } = await ResetPasswordWithEmail(formData);

      if (success) {
        toast.success(
          'Reset password link sent successfully, check your emails',
          {
            duration: 4000,
            style: {
              background: '#041527',
              color: '#fff',
            },
          }
        );
        
      } else {
        toast.error(
          error || 'Something went wrong. Please try again.',
          {
            duration: 4000,
            style: {
              background: '#041527',
              color: '#fff',
            },
          }
        );
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto pt-[25%] lg:pt-[10%] p-6
     text-gray-900">
      <div className="flex justify-center"><Logo/></div>
      <h1 className="text-center text-2xl">Enter your email to reset your password.</h1>
      <form className="space-y-4 mx-auto mb-10" action={handleSubmit}>
        <p className="text-center text-gray-400">We will send you a link to reset your password.</p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border p-2 w-full rounded-sm mt-5"
        />

        <button
          type="submit"
          disabled={isPending}
          className="bg-[#A2B06D] cursor-pointer text-white px-4 py-2 w-full rounded disabled:opacity-50"
        >
          {isPending ? 'Sending Email...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default Page;
