"use client";

import Sale from "./Sale";
import Testimonials from "./Testimonials";

export default function SaleAndTestimonials() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background image and gradient */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 mx-auto max-w-7xl overflow-hidden xl:px-8">
          <img
            alt=""
            src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-sale-full-width.jpg"
            className="size-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-white/75" />
        <div className="absolute inset-0 bg-linear-to-t from-white via-white" />
      </div>

      {/* Sale */}
      <Sale />

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}
