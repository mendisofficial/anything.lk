"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

function CartBadge() {
  const { cartCount } = useCart();
  return <>{cartCount}</>;
}

const navigation = {
  categories: [
    {
      name: "Laptops & Computers",
      featured: [
        { name: "Gaming Laptops", href: "#" },
        { name: "Business Laptops", href: "#" },
        { name: "Desktops & All-in-One PCs", href: "#" },
      ],
      collection: [
        { name: "All Laptops", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Best Sellers", href: "#" },
        { name: "On Sale", href: "#" },
      ],
      categories: [
        { name: "Windows Laptops", href: "#" },
        { name: "MacBooks", href: "#" },
        { name: "Chromebooks", href: "#" },
        { name: "Custom PCs", href: "#" },
        { name: "Computer Accessories", href: "#" },
      ],
      brands: [
        { name: "Apple", href: "#" },
        { name: "Dell", href: "#" },
        { name: "HP", href: "#" },
        { name: "Asus", href: "#" },
        { name: "Lenovo", href: "#" },
      ],
    },
    {
      name: "Mobile & Tablets",
      featured: [
        { name: "Smartphones", href: "#" },
        { name: "Tablets", href: "#" },
        { name: "Smartwatches", href: "#" },
      ],
      collection: [
        { name: "All Devices", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Best Sellers", href: "#" },
        { name: "On Sale", href: "#" },
      ],
      categories: [
        { name: "Android Phones", href: "#" },
        { name: "iPhones", href: "#" },
        { name: "Tablets", href: "#" },
        { name: "Wearables", href: "#" },
        { name: "Mobile Accessories", href: "#" },
      ],
      brands: [
        { name: "Apple", href: "#" },
        { name: "Samsung", href: "#" },
        { name: "Xiaomi", href: "#" },
        { name: "OnePlus", href: "#" },
        { name: "Huawei", href: "#" },
      ],
    },
    {
      name: "Accessories & Gadgets",
      featured: [
        { name: "Headphones", href: "#" },
        { name: "Keyboards & Mice", href: "#" },
        { name: "Chargers & Power Banks", href: "#" },
      ],
      collection: [
        { name: "All Accessories", href: "#" },
        { name: "Trending Now", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "On Sale", href: "#" },
      ],
      categories: [
        { name: "Audio Devices", href: "#" },
        { name: "Computer Peripherals", href: "#" },
        { name: "Storage Devices", href: "#" },
        { name: "Smart Home Devices", href: "#" },
        { name: "Gaming Accessories", href: "#" },
      ],
      brands: [
        { name: "Logitech", href: "#" },
        { name: "Sony", href: "#" },
        { name: "JBL", href: "#" },
        { name: "Anker", href: "#" },
        { name: "Razer", href: "#" },
      ],
    },
  ],
  pages: [{ name: "Collections", href: "/collections" }],
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.status) {
        logout();
        router.push("/auth/signin");
      } else {
        console.error("Logout failed:", response.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="relative z-40 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category, categoryIdx) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-12 px-4 pt-10 pb-6"
                  >
                    <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-10">
                        <div>
                          <p
                            id={`mobile-featured-heading-${categoryIdx}`}
                            className="font-medium text-gray-900"
                          >
                            Featured
                          </p>
                          <ul
                            role="list"
                            aria-labelledby={`mobile-featured-heading-${categoryIdx}`}
                            className="mt-6 space-y-6"
                          >
                            {category.featured.map((item) => (
                              <li key={item.name} className="flex">
                                <a href={item.href} className="text-gray-500">
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p
                            id="mobile-categories-heading"
                            className="font-medium text-gray-900"
                          >
                            Categories
                          </p>
                          <ul
                            role="list"
                            aria-labelledby="mobile-categories-heading"
                            className="mt-6 space-y-6"
                          >
                            {category.categories.map((item) => (
                              <li key={item.name} className="flex">
                                <a href={item.href} className="text-gray-500">
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-10">
                        <div>
                          <p
                            id="mobile-collection-heading"
                            className="font-medium text-gray-900"
                          >
                            Collection
                          </p>
                          <ul
                            role="list"
                            aria-labelledby="mobile-collection-heading"
                            className="mt-6 space-y-6"
                          >
                            {category.collection.map((item) => (
                              <li key={item.name} className="flex">
                                <a href={item.href} className="text-gray-500">
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p
                            id="mobile-brand-heading"
                            className="font-medium text-gray-900"
                          >
                            Brands
                          </p>
                          <ul
                            role="list"
                            aria-labelledby="mobile-brand-heading"
                            className="mt-6 space-y-6"
                          >
                            {category.brands.map((item) => (
                              <li key={item.name} className="flex">
                                <a href={item.href} className="text-gray-500">
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link
                    href={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {isAuthenticated ? (
                <>
                  <div className="flow-root">
                    <div className="-m-2 block p-2">
                      <p className="font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  {user?.isAdmin ? (
                    <div className="flow-root">
                      <Link
                        href="/admin"
                        className="-m-2 block p-2 font-medium text-indigo-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    </div>
                  ) : null}
                  <div className="flow-root">
                    <Link
                      href="/settings"
                      className="-m-2 block p-2 font-medium text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Account settings
                    </Link>
                  </div>
                  <div className="flow-root">
                    <button
                      onClick={handleLogout}
                      className="-m-2 block p-2 font-medium text-red-600 cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flow-root">
                    <Link
                      href="/auth/signup"
                      className="-m-2 block p-2 font-medium text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create an account
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      href="/auth/signin"
                      className="-m-2 block p-2 font-medium text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <header className="relative z-10">
        <nav aria-label="Top">
          {/* Top navigation */}
          <div className="bg-gray-900">
            <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <p className="flex-1 text-center text-sm font-medium text-white lg:flex-none">
                Get free delivery on orders over 10,000 LKR
              </p>

              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-white">
                      Welcome, {user?.firstName} {user?.lastName}
                    </span>
                    {user?.isAdmin ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="h-6 w-px bg-gray-600"
                        />
                        <Link
                          href="/admin"
                          className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
                        >
                          Admin Panel
                        </Link>
                      </>
                    ) : null}
                    <span aria-hidden="true" className="h-6 w-px bg-gray-600" />
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-white hover:text-gray-100"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className="text-sm font-medium text-white hover:text-gray-100"
                    >
                      Create an account
                    </Link>
                    <span aria-hidden="true" className="h-6 w-px bg-gray-600" />
                    <Link
                      href="/auth/signin"
                      className="text-sm font-medium text-white hover:text-gray-100"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Secondary navigation */}
          <div className="bg-white">
            <div className="border-b border-gray-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:items-center">
                    <Link href="/">
                      <span className="sr-only">Your Company</span>
                      <Image
                        alt="Anything.lk"
                        src="/text-logo.png"
                        className="h-12 w-auto"
                        width={500}
                        height={500}
                      />
                    </Link>
                  </div>

                  <div className="hidden h-full lg:flex">
                    {/* Flyout menus */}
                    <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                      <div className="flex h-full space-x-8">
                        {navigation.categories.map((category, categoryIdx) => (
                          <Popover key={category.name} className="flex">
                            <div className="relative flex">
                              <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:text-indigo-600">
                                {category.name}
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
                                />
                              </PopoverButton>
                            </div>
                            <PopoverPanel
                              transition
                              className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                            >
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 top-1/2 bg-white shadow-sm"
                              />
                              <div className="relative bg-white">
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                  <div className="grid grid-cols-2 items-start gap-x-8 gap-y-10 pt-10 pb-12">
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                      <div>
                                        <p
                                          id={`desktop-featured-heading-${categoryIdx}`}
                                          className="font-medium text-gray-900"
                                        >
                                          Featured
                                        </p>
                                        <ul
                                          role="list"
                                          aria-labelledby={`desktop-featured-heading-${categoryIdx}`}
                                          className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                        >
                                          {category.featured.map((item) => (
                                            <li
                                              key={item.name}
                                              className="flex"
                                            >
                                              <a
                                                href={item.href}
                                                className="hover:text-gray-800"
                                              >
                                                {item.name}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <p
                                          id="desktop-categories-heading"
                                          className="font-medium text-gray-900"
                                        >
                                          Categories
                                        </p>
                                        <ul
                                          role="list"
                                          aria-labelledby="desktop-categories-heading"
                                          className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                        >
                                          {category.categories.map((item) => (
                                            <li
                                              key={item.name}
                                              className="flex"
                                            >
                                              <a
                                                href={item.href}
                                                className="hover:text-gray-800"
                                              >
                                                {item.name}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                      <div>
                                        <p
                                          id="desktop-collection-heading"
                                          className="font-medium text-gray-900"
                                        >
                                          Collection
                                        </p>
                                        <ul
                                          role="list"
                                          aria-labelledby="desktop-collection-heading"
                                          className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                        >
                                          {category.collection.map((item) => (
                                            <li
                                              key={item.name}
                                              className="flex"
                                            >
                                              <a
                                                href={item.href}
                                                className="hover:text-gray-800"
                                              >
                                                {item.name}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div>
                                        <p
                                          id="desktop-brand-heading"
                                          className="font-medium text-gray-900"
                                        >
                                          Brands
                                        </p>
                                        <ul
                                          role="list"
                                          aria-labelledby="desktop-brand-heading"
                                          className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                        >
                                          {category.brands.map((item) => (
                                            <li
                                              key={item.name}
                                              className="flex"
                                            >
                                              <a
                                                href={item.href}
                                                className="hover:text-gray-800"
                                              >
                                                {item.name}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PopoverPanel>
                          </Popover>
                        ))}
                        {navigation.pages.map((page) => (
                          <Link
                            key={page.name}
                            href={page.href}
                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            {page.name}
                          </Link>
                        ))}
                      </div>
                    </PopoverGroup>
                  </div>

                  {/* Mobile menu and search (lg-) */}
                  <div className="flex flex-1 items-center lg:hidden">
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(true)}
                      className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                    >
                      <span className="sr-only">Open menu</span>
                      <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>

                    {/* Search */}
                    <Link
                      href="#"
                      className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon
                        aria-hidden="true"
                        className="size-6"
                      />
                    </Link>
                  </div>

                  {/* Logo (lg-) */}
                  <Link href="/" className="lg:hidden">
                    <span className="sr-only">Your Company</span>
                    <Image
                      alt="Anything.lk"
                      src="/text-logo.png"
                      className="h-12 w-auto"
                      width={500}
                      height={500}
                    />
                  </Link>

                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      <div className="flex space-x-8">
                        <div className="hidden lg:flex">
                          <Link
                            href="/search"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Search</span>
                            <MagnifyingGlassIcon
                              aria-hidden="true"
                              className="size-6"
                            />
                          </Link>
                        </div>

                        <div className="flex">
                          <Link
                            href="/settings"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Account</span>
                            <UserIcon aria-hidden="true" className="size-6" />
                          </Link>
                        </div>
                      </div>

                      <span
                        aria-hidden="true"
                        className="mx-4 h-6 w-px bg-gray-200 lg:mx-6"
                      />

                      <div className="flow-root">
                        <Link
                          href="/cart"
                          className="group -m-2 flex items-center p-2"
                        >
                          <ShoppingCartIcon
                            aria-hidden="true"
                            className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                            {/* cart count will be populated by CartBadge component */}
                            <CartBadge />
                          </span>
                          <span className="sr-only">
                            items in cart, view bag
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
