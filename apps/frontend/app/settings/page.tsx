"use client";

import { useState } from "react";
import {
  CubeIcon,
  UserCircleIcon,
  ArchiveBoxArrowDownIcon,
  ArchiveBoxIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AccountDetails from "./components/AccountDetails";
import AddProducts from "./components/AddProducts";
import Addresses from "./components/Addresses";
import MyProducts from "./components/MyProducts";
import MyCollections from "./components/MyCollections";
import StoreFrontTemplate from "../components/StoreFrontTemplate";

const sideNavigation = [
  {
    id: "Account Details",
    name: "Account Details",
    icon: UserCircleIcon,
  },
  {
    id: "Add Products",
    name: "Add Products",
    icon: ArchiveBoxArrowDownIcon,
  },
  { id: "Product Listing", name: "Product Listing", icon: ArchiveBoxIcon },
  { id: "Collections", name: "Collections", icon: ArchiveBoxIcon },
  { id: "Orders", name: "Orders", icon: CubeIcon },
  { id: "Addresses", name: "Addresses", icon: HomeIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account Details");

  return (
    <ProtectedRoute>
      <StoreFrontTemplate>
        <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
          <h1 className="sr-only">General Settings</h1>

          <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
            <nav className="flex-none px-4 sm:px-6 lg:px-0">
              <ul
                role="list"
                className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
              >
                {sideNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={"#"}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(item.id);
                      }}
                      className={classNames(
                        activeTab === item.id
                          ? "bg-gray-50 text-vivid-magenta"
                          : "text-gray-700 hover:bg-gray-50 hover:text-vivid-magenta",
                        "group flex gap-x-3 rounded-md py-2 pr-3 pl-2 text-sm/6 font-semibold"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          activeTab === item.id
                            ? "text-vivid-magenta"
                            : "text-gray-400 group-hover:text-vivid-magenta",
                          "size-6 shrink-0"
                        )}
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
            {activeTab === "Account Details" && <AccountDetails />}
            {activeTab === "Add Products" && <AddProducts />}
            {activeTab === "Product Listing" && <MyProducts />}
            {activeTab === "Collections" && <MyCollections />}
            {activeTab === "Addresses" && <Addresses />}
          </main>
        </div>
      </StoreFrontTemplate>
    </ProtectedRoute>
  );
}
