"use client";

const testimonials = [
  {
    id: 1,
    quote:
      "Ordered my laptop on Monday and got it by Wednesday! Everything was perfectly packed and exactly as described.",
    attribution: "Ruwan Perera, Colombo",
  },
  {
    id: 2,
    quote:
      "Had to exchange a phone due to a color mismatch — the return process was quick and easy. Ended up getting an upgrade!",
    attribution: "Dilani Fernando, Kandy",
  },
  {
    id: 3,
    quote:
      "Bought a pair of wireless earbuds during the sale — amazing sound quality and unbeatable price. Will definitely shop here again.",
    attribution: "Hashan Jayasuriya, Galle",
  },
];

export default function Testimonials() {
  return (
    <section
      aria-labelledby="testimonial-heading"
      className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <h2
          id="testimonial-heading"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          What are people saying?
        </h2>

        <div className="mt-16 space-y-16 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-8">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.id} className="sm:flex lg:block">
              <svg
                width={24}
                height={18}
                viewBox="0 0 24 18"
                aria-hidden="true"
                className="shrink-0 text-gray-300"
              >
                <path
                  d="M0 18h8.7v-5.555c-.024-3.906 1.113-6.841 2.892-9.68L6.452 0C3.188 2.644-.026 7.86 0 12.469V18zm12.408 0h8.7v-5.555C21.083 8.539 22.22 5.604 24 2.765L18.859 0c-3.263 2.644-6.476 7.86-6.451 12.469V18z"
                  fill="currentColor"
                />
              </svg>
              <div className="mt-8 sm:mt-0 sm:ml-6 lg:mt-10 lg:ml-0">
                <p className="text-lg text-gray-600">{testimonial.quote}</p>
                <cite className="mt-4 block font-semibold text-gray-900 not-italic">
                  {testimonial.attribution}
                </cite>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
