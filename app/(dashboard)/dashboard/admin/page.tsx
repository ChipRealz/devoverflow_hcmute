import { Protect } from '@clerk/nextjs';
import Link from "next/link";

import React from 'react'

const page = () => {
  return (
    <Protect
      condition={(has) => has({ role: 'org:admin' })}
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-lg font-medium">You do not have access to this page.</p>
            <Link href="/dashboard" passHref>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Go Back to Home
              </button>
            </Link>
          </div>
        </div>
      }
    >
    </Protect>
  )
}

export default page