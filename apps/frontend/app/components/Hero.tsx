"use client";

import Image from "next/image";
import Link from "next/link";

const offers = [
  {
    name: "Download the Anything.LK App",
    description: "LKR 1,500 off first order",
    href: "#",
  },
  {
    name: "Free Returns",
    description: "30 days hassle-free",
    href: "#",
  },
  {
    name: "Join Our Newsletter",
    description: "10% off instantly",
    href: "#",
  },
];

export default function Hero() {
  return (
    <div className="flex flex-col border-b border-gray-200 lg:border-0">
      <nav aria-label="Offers" className="order-last lg:order-first">
        <div className="mx-auto max-w-7xl lg:px-8">
          <ul
            role="list"
            className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0"
          >
            {offers.map((offer) => (
              <li key={offer.name} className="flex flex-col">
                <a
                  href={offer.href}
                  className="relative flex flex-1 flex-col justify-center bg-white px-4 py-6 text-center focus:z-10"
                >
                  <p className="text-sm text-gray-500">{offer.name}</p>
                  <p className="font-semibold text-gray-900">
                    {offer.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute hidden h-full w-1/2 bg-gray-100 lg:block"
        />
        <div className="relative bg-gray-100 lg:bg-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
            <div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
              <div className="lg:pr-16">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
                  Your Tech. Your Way.
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                  From the latest laptops to smartphones, get the best deals in
                  Sri Lanka — all in one place.
                </p>
                <div className="mt-6">
                  <Link
                    href="/search"
                    className="inline-block rounded-md border border-transparent bg-vivid-magenta px-8 py-3 font-medium text-white hover:bg-vivid-magenta-hover"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-48 w-full sm:h-64 lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-1/2">
          <Image
            alt=""
            src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-hero-half-width.jpg"
            className="size-full object-cover"
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
}
