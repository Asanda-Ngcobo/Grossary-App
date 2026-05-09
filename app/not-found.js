

import Link from "next/link";

export default function NotFound({}) {
    return (
      <main className='flex justify-center items-center flex-col gap-6'>
        <h1 className='text-3xl font-semibold'>Not Found</h1>
        <p className='text-lg'>Could not find requested resource</p>
  
        <button className='inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg'
        >
          <Link href="/">Return Home</Link>
        </button>
      </main>
    );
  }
