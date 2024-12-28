import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

import NavLinks from "./navbar/NavLinks";

const LeftSidebar = async () => {
  const session = await auth();

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: ROUTES.SIGN_IN });
  };
  return (
    <section className=" custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r-2 p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks />
      </div>

      <div className="flex flex-col gap-3">
        {session?.user ? (
          <Button
            onClick={handleSignOut}
            className="btn-secondary small-medium min-h-[41px] w-full rounded-lg "
          >
            <Image
              src="/icons/account.svg"
              width={20}
              height={20}
              alt="log out icon"
            />
            <span className="text-dark300_light900 hidden lg:block">
              Log out
            </span>
          </Button>
        ) : (
          <>
            <Button
              className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
              asChild
            >
              <Link href={ROUTES.SIGN_IN}>
                <span className="primary-text-gradient max-lg:hidden">
                  Log In
                </span>
                <Image
                  src="/icons/account.svg"
                  width={20}
                  height={20}
                  alt="Account"
                  className="invert-colors lg:hidden"
                />
              </Link>
            </Button>

            <Button
              className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none"
              asChild
            >
              <Link href={ROUTES.SIGN_UP}>
                <span className="max-lg:hidden">Sign Up</span>
                <Image
                  src="/icons/sign-up.svg"
                  width={20}
                  height={20}
                  alt="Sign-Up"
                  className="lg:hidden"
                />
              </Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default LeftSidebar;
