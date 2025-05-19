"use client";
import { useAuth } from "@clerk/nextjs";
import React from "react";

function Hero() {
  // Hero page uses an a tag to conditionally take a user to the dashboard or sign up page based on their authentication state.
  const { isSignedIn } = useAuth();
  return (
    <section className="bg-white lg:grid lg:h-screen lg:place-content-center flex flex-col">
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Monitor cash flow and take charge of
            <span className="text-purple-700"> your </span>
            finances.
          </h1>

          <div className="mt-4 pt-10 flex justify-center gap-4 sm:mt-6">
            <a
              className="inline-block rounded-md border border-purple-700 bg-purple-700 px-7 py-3 font-medium text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out hover:bg-purple-600"
              href={isSignedIn ? "/dashboard" : "/sign-up"}
            >
              Lets get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
