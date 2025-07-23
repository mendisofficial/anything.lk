"use client";

const collections = [
  {
    name: "Desk and Office",
    description: "Work from home accessories",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-01.jpg",
    imageAlt:
      "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
    href: "#",
  },
  {
    name: "Self-Improvement",
    description: "Journals and note-taking",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-02.jpg",
    imageAlt:
      "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
    href: "#",
  },
  {
    name: "Travel",
    description: "Daily commute essentials",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-03.jpg",
    imageAlt: "Collection of four insulated travel bottles on wooden shelf.",
    href: "#",
  },
];

export default function Collections() {
  return (
    <section aria-labelledby="collections-heading" className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2
            id="collections-heading"
            className="text-2xl font-bold text-gray-900"
          >
            Collections
          </h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-6">
            {collections.map((collection) => (
              <div key={collection.name} className="group relative">
                <img
                  alt={collection.imageAlt}
                  src={collection.imageSrc}
                  className="w-full rounded-lg bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-2/1 lg:aspect-square"
                />
                <h3 className="mt-6 text-sm text-gray-500">
                  <a href={collection.href}>
                    <span className="absolute inset-0" />
                    {collection.name}
                  </a>
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {collection.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
