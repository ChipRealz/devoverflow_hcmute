import ManagerLeftSideBar from "@/components/shared/ManagerLeftSidebar";
import ManagerRightSideBar from "@/components/shared/ManagerRightSidebar";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";
import type { PropsWithChildren } from "react";
import { Protect } from "@clerk/nextjs";
import Link from "next/link";

const ManagerLayout = ({ children }: PropsWithChildren) => {
  return (
    <Protect
      condition={(has) =>
        has({ role: "org:admin" }) || has({ role: "org:moderator" })
      }
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-lg font-medium">
              You do not have access to this page.
            </p>
            <Link href="/" passHref>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Go Back to Home
              </button>
            </Link>
          </div>
        </div>
      }
    >
      <main className="background-light850_dark100 relative">
        <Navbar />
        <div className="flex">
          <ManagerLeftSideBar />

          <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </section>

          <ManagerRightSideBar/>
        </div>
      </main>
    </Protect>
  );
};

export default ManagerLayout;
