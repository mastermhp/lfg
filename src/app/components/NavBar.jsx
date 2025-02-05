"use client";

import Link from "next/link";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

export function NavBar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="bg-[#1c2333] p-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#b42c1d] rounded-full flex items-center justify-center">
            <span className="text-white font-bold">Lfg</span>
          </div>
          <span className="text-white text-xl font-semibold">Libraryofg</span>
        </Link>
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              {user.primaryEmailAddress?.emailAddress ===
                process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <Link href="/admin" className="text-rose-700 pr-12 text-md font-bold">
                  Admin Panel
                </Link>
              )}
              <span className="text-white text-xs">Welcome, {user.firstName}!</span>

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
