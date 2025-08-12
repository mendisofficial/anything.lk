"use client";

import Footer from "./Footer";
import Header from "./Header";

export default function StoreFrontTemplate({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="bg-white">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
