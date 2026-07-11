'use client'

import { ChevronRight, User, X } from "@deemlol/next-icons"
import Link from "next/link"

// Store icon COMPONENTS, not JSX to avoid hydration mismatches
const links = [
  {
    id: 1,
    link: `/company/about`,
    name: 'About',
    icon: ChevronRight,
  },
  {
    id: 2,
    link: `/company/blog`,
    name: 'How To Shop (Our Blog)',
    icon: ChevronRight,
  },
//   {
//     id: 3,
//     link: `/shop-with-purpose`,
//     name: 'Shop With Purpose',
//     icon: ChevronRight,
//   },
  // {
  //   id: 4,
  //   link: `/company/how-it-works`,
  //   name: 'How It works',
  //   icon: ChevronRight,
  // },
  {
    id: 5,
    link: `/company/faq`,
    name: 'Frequently Asked Question',
    icon: ChevronRight,
  },
]


const features = [
  {
    id: 1,
    link: `/features/planning-ahead`,
    name: 'Plan Ahead',
    icon: ChevronRight,
  },
  {
    id: 2,
    link: `/features/staying-under-budget`,
    name: 'Stay Within Budget',
    icon: ChevronRight,
  },
  {
    id: 3,
    link: `/features/loyalty-cards`,
    name: 'Store Loyalty Cards',
    icon: ChevronRight,
  },
  // {
  //   id: 4,
  //   link: `/features/digital-slips`,
  //   name: 'Digital Slips',
  //   icon: ChevronRight,
  // },
  {
    id: 5,
    link: `/for-grossary-stores`,
    name: 'For Grocery Stores',
    icon: ChevronRight,
  },
]
export default function MenuContent({ onToggle, onCart, onAccount }) {
  return (
    <>
      <div
        className="
        flex flex-row justify-between 
        px-4
        duration-700
        overflow-y-auto 
        absolute
        top-0
        bg-white
        z-10
        lg:w-[25%]
        w-screen
        py-3
      "
      >
        <h1 className="font-semibold">Menu</h1>

        <ul className="flex flex-row cursor-pointer">
          
          <li className="mx-6 text-lg hover:text-[#ACF532]"><Link href='/login'><User /></Link></li>
        
          <li className="mx-6 text-xl hover:text-[#ACF532]" onClick={onToggle}>
            <X />
          </li>
        </ul>
      </div>

    

            <div className="h-fit text-xs m-2 py-7 rounded-2xl font-semibold cursor-pointer">
          <h3 className="text-gray-300 capitalize text-center">Features</h3>
        {features.map((link) => {
          const Icon = link.icon;
          return (
            <ul key={link.id} className="text-gray-600 text-xl">
              <li className="py-2"
              onClick={onToggle}>
                <Link
                  href={link.link}
                  className="flex justify-between pb-4 hover:bg-gray-200 hover:rounded-xl p-4"
                >
                  {link.name}
                  <Icon />
                </Link>
              </li>
            </ul>
          );
        })}
      </div>

        <div className="h-fit text-xs m-2 py-7 rounded-2xl font-semibold cursor-pointer">
          <h3 className="text-gray-300 capitalize text-center">Company</h3>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <ul key={link.id} className="text-gray-600 text-xl">
              <li className="py-2"
              onClick={onToggle}>
                <Link
                  href={link.link}
                  className="flex justify-between pb-4 hover:bg-gray-200 hover:rounded-xl p-4"
                >
                  {link.name}
                  <Icon />
                </Link>
              </li>
            </ul>
          );
        })}
      </div>
    </>
  );
}
