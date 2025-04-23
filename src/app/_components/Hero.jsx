import React from 'react'
import Image from 'next/image'

function Hero() {
  return (
    <section className="bg-white lg:grid lg:h-screen lg:place-content-center flex flex-col">
        <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-prose text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Monitor cash flow and make
                <span className="text-purple-700"> yourself </span>
                feel poor!
            </h1>

            {/* <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident
                accusamus impedit minima harum corporis iusto.
            </p> */}

            <div className="mt-4 pt-10 flex justify-center gap-4 sm:mt-6">
                <a
                className="inline-block rounded-md border border-purple-700 bg-purple-700 px-7 py-3 font-medium text-white shadow-sm transition-colors hover:bg-purple-600"
                href="/sign-up"
                >
                Get Started
                </a>
            </div>
            </div>
        </div>
        {/* <Image src="./hero.png" alt="hero" width={1000} height={750} className="rounded-xl border-2 border-purple-700" /> */}
    </section>
  )
}

export default Hero