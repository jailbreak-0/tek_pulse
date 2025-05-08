// components/Navbar.tsx

import Link from "next/link";
import ThemeToggle from "@/context/ThemeToggle";
import {logout }from "@/lib/logout";

export default function Navbar() {

  return (
    <nav className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 shadow-md">
      <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
        TekPulse
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/store" className="text-sm text-gray-700 dark:text-gray-300">
          Store
        </Link>
        <Link href="/clubs" className="text-sm text-gray-700 dark:text-gray-300">
          Clubs
        </Link>
        <ThemeToggle />
      </div>
      <div className="">
        <button
          onClick={logout}
          className="mt-4 text-sm text-center text-white rounded bg-[#22AB39] hover:bg-green-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
