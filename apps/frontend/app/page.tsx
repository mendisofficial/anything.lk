"use client";

import StoreFrontTemplate from "./components/StoreFrontTemplate";
import Hero from "./components/Hero";
import TrendingProducts from "./components/TrendingProducts";
import Collections from "./components/Collections";
import SaleAndTestimonials from "./components/SaleAndTestimonials";

export default function HomePage() {
  return (
    <StoreFrontTemplate>
      <main>
        <Hero />
        <TrendingProducts />
        <Collections />
        <SaleAndTestimonials />
      </main>
    </StoreFrontTemplate>
  );
}
