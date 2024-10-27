"use client";

import { managersidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const ManagerLeftSideBar = () => {
  useAuth();
  const pathname = usePathname();
  // // Define the specific clerkIds
  // const clerkIds = ["user_2n9yKIQKzFEWiFSNTtGohNtgHd0", "user_2n9yRQAbVm75yaEwAFrd3sGmKVh", "user_2npM4qgGMMBsk8rnbBtb38B6jBk"];
  // // Render the sidebar only if userId is one of the clerkIds
  // if (!userId || !clerkIds.includes(userId)) return null;
  // Filter only for Home and Manage Questions links
  
  const filteredLinks = managersidebarLinks.filter(
    (item) =>
      item.route === "/dashboard/moderator" || item.route === "/dashboard/admin"
  );

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {filteredLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          return (
            <Link
              href={item.route}
              key={item.label}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ManagerLeftSideBar;
