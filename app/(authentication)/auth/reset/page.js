'use client';

import { ResetPasswordWithEmail } from "@/app/_lib/actions";
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
    <div className="max-w-3xl mx-auto pt-[25%] lg:pt-[10%] p-6 text-gray-900">
      <form className="space-y-4 mx-auto mb-10" action={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border p-2 w-full rounded-sm"
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
