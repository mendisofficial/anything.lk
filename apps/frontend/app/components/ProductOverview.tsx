import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { Product, ProductImage } from "../product/hooks/useSingleProduct";
import useAddToCart from "../cart/hooks/useAddToCart";
import { useToast } from "../context/ToastContext";
import { useCart } from "../context/CartContext";

interface ProductOverviewProps {
  product: Product | null;
  productImages: ProductImage[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductOverview({
  product,
  productImages,
}: ProductOverviewProps) {
  const { addToCart, loading: adding } = useAddToCart();
  const { success, error } = useToast();
  const { increment } = useCart();
  if (!product) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="animate-pulse">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-4 w-24"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableImages =
    productImages.length > 0
      ? productImages
      : [
          {
            id: 1,
            name: "Product image",
            src: "https://placehold.co/400x400",
            alt: product.title,
          },
        ];

  const productDetails = [
    {
      name: "Product Information",
      items: [
        `Brand: ${product.model.brand.name}`,
        `Model: ${product.model.name}`,
        `Storage: ${product.storage.value}`,
        `Color: ${product.color.value}`,
        `Condition: ${product.condition.value}`,
        `Available Quantity: ${product.qty}`,
      ],
    },
    {
      name: "Seller Information",
      items: [
        `Seller: ${product.user.first_name} ${product.user.last_name}`,
        `Listed: ${new Date(product.created_at).toLocaleDateString()}`,
      ],
    },
  ];

  const handleAddToCart = async () => {
    if (!product) return;
    const res = await addToCart(product.id, 1);
    if (res.status) {
      success(res.message || "Added to cart");
      increment(1);
    } else {
      error(res.message || "Failed to add to cart");
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {availableImages.map((image) => (
                  <Tab
                    key={image.id}
                    className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-vivid-magenta/50 focus:ring-offset-4 focus:outline-hidden"
                  >
                    <span className="sr-only">{image.name}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        alt={image.alt}
                        src={image.src}
                        className="size-full object-cover"
                        width={500}
                        height={500}
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-vivid-magenta"
                    />
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels>
              {productImages.map((image) => (
                <TabPanel key={image.id}>
                  <Image
                    alt={image.alt}
                    src={image.src}
                    className="aspect-square w-full object-cover sm:rounded-lg"
                    width={500}
                    height={500}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.title}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                LKR {product.price.toLocaleString()}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        product.rating > rating
                          ? "text-vivid-magenta"
                          : "text-gray-300",
                        "size-5 shrink-0"
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="space-y-6 text-base text-gray-700"
              />
            </div>

            <form className="mt-6">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">Color</h3>

                <fieldset aria-label="Choose a color" className="mt-2">
                  <div className="flex items-center gap-x-3">
                    {product && (
                      <div
                        key={product.color.id}
                        className="flex rounded-full outline -outline-offset-1 outline-black/10"
                      >
                        <input
                          defaultValue={product.color.id}
                          defaultChecked={product.color.id === product.color.id}
                          name="color"
                          type="radio"
                          aria-label={product.color.value}
                          className={classNames(
                            product.color.classes,
                            "size-8 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </fieldset>
              </div>

              <div className="mt-10 flex">
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-vivid-magenta px-8 py-3 text-base font-medium text-white hover:bg-vivid-magenta-hover disabled:bg-vivid-magenta/50 disabled:cursor-not-allowed focus:ring-2 focus:ring-vivid-magenta focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:w-full"
                  disabled={adding || (product?.qty ?? 0) < 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart();
                  }}
                >
                  {adding
                    ? "Adding..."
                    : (product?.qty ?? 0) < 1
                    ? "Out of stock"
                    : "Add to bag"}
                </button>

                {/* Removed adding to favorites button */}
                {/* <button
                  type="button"
                  className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
                  <span className="sr-only">Add to favorites</span>
                </button> */}
              </div>
            </form>

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {productDetails.map((detail) => (
                  <Disclosure key={detail.name} as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-gray-900 group-data-open:text-vivid-magenta">
                          {detail.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="hidden size-6 text-vivid-magenta group-hover:text-vivid-magenta-hover group-data-open:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pb-6">
                      <ul
                        role="list"
                        className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300"
                      >
                        {detail.items.map((item) => (
                          <li key={item} className="pl-2">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
