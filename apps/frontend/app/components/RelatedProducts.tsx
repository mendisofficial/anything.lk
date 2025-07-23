"use client";

const relatedProducts = [
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
    imageAlt: "Front of men's Basic Tee in white.",
    price: "$35",
    color: "Aspen White",
  },
  {
    id: 2,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
    imageAlt: "Front of men's Basic Tee in dark gray.",
    price: "$35",
    color: "Charcoal",
  },
  {
    id: 3,
    name: "Artwork Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: "$35",
    color: "Iso Dots",
  },
  {
    id: 4,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
];

export default function RelatedProducts() {
  return (
    <section aria-labelledby="related-heading" className="mt-16 sm:mt-24">
      <h2 id="related-heading" className="text-lg font-medium text-gray-900">
        Customers also purchased
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {relatedProducts.map((relatedProduct) => (
          <div key={relatedProduct.id} className="group relative">
            <img
              alt={relatedProduct.imageAlt}
              src={relatedProduct.imageSrc}
              className="aspect-square w-full rounded-md object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            />
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href={relatedProduct.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {relatedProduct.name}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {relatedProduct.color}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {relatedProduct.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
