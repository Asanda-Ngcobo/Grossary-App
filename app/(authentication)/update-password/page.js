'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@/app/_lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        setSession(session);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Set New Password</h1>
      <input
        type="password"
        required
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-[#A2B06D] text-white px-4 py-2 w-full">
        Update Password
      </button>
    </form>
  );
}
