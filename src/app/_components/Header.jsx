"use client";
import React from "react";
import { KeyRound } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 bg-purple-700 text-white flex flex-row justify-end items-center shadow-md">
      <SignedOut>
        <div className="flex flex-row gap-5">
          <SignInButton className="h-10 w-24 bg-accent rounded-lg text-primary flex items-center justify-center font-semibold cursor-pointer shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out" />
          <SignUpButton className="h-10 w-24 bg-primary rounded-lg text-accent flex items-center justify-center font-semibold cursor-pointer shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out" />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-row items-center gap-5">
          <h2 className="text-lg font-semibold">
            Welcome, {user ? `${user.firstName}` : "Loading..."}
          </h2>
          <UserButton className="w-10 h-10" />
        </div>
      </SignedIn>
    </div>
  );
}
