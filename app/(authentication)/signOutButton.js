
'use client';

import { LogOut } from '@deemlol/next-icons';
import { logout } from '../_lib/actions';
import { useTransition } from 'react';

function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={() => {
        startTransition(() => {
          logout();
        });
      }}
    >
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2  py-2
        cursor-pointer  text-white rounded  disabled:opacity-50"
      >
        {isPending ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Logging out...</span>
          </>
        ) : (
          <span className='flex gap-2'><LogOut/> Sign Out</span>
        )}
      </button>
    </form>
  );
}

export default SignOutButton;
