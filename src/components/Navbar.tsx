// components/Navbar.tsx
import Link from "next/link";
import ThemeToggle from "@/context/ThemeToggle";
import {logout }from "@/lib/logout";

export default function Navbar() {

  return (
    <nav className="flex justify-between items-center px-8 py-3 bg-gray-400 dark:bg-gray-900 shadow-md">
      <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
        TekPulse
      </Link>
      <div className="flex items-center gap-4">
      </div>
      <div className="flex gap-4 items-center">
        <button
          onClick={logout}
          className="text-sm text-center text-white rounded bg-[#22AB39] hover:bg-green-700 w-20 py-2 font-semibold"
        >
          Logout
        </button>
        <ThemeToggle />
      </div>
    </nav>
  );
}
