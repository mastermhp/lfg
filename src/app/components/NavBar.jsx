"use client";

import Link from "next/link";
import { Grechen_Fuemen } from "next/font/google"
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

const ADMIN_EMAILS = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  "mehediparash0720@gmail.com",
  "minhazimran143@gmail.com",
  "minhazimran143@gmail.com",
  "fachuki69@gmail.com"
];

const grechenFuemen = Grechen_Fuemen({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export function NavBar() {
  const { isSignedIn, user } = useUser();

  // Function to check if the user is an admin
  const isAdmin = () => {
    return ADMIN_EMAILS.includes(user?.primaryEmailAddress?.emailAddress || "");
  };

  return (
    <nav className="neon-background p-4 border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-14 h-14 bg-[#b42c1d] rounded-full flex items-center justify-center">
            <img src="/mr5.jpeg" className="object-cover overflow-hidden w-full h-full rounded-full" alt="" />
          </div>
          <span className={`${grechenFuemen.className} text-white text-xl font-semibold`}>Library of G</span>
        </Link>
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              {isAdmin() && (
                <Link
                  href="/admin"
                  className=" text-rose-700 pr-12 text-md font-bold"
                >
                  Admin Panel
                </Link>
              )}
              <span className=" text-white text-xs">
                Welcome, {user.firstName}!
              </span>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-white text-sm">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-white">Sign Up</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
