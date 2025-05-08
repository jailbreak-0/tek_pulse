import Head from "next/head";
import Link from "next/link";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/context/ThemeToggle";

export default function Home() {
  return (
    <ThemeProvider>
    <div className="min-h-screen bg-gray-100 p-4">
       <Head>
        <title>TekPulse</title>
      </Head>
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#22AB39]">Welcome to TekPulse</h1>
        <nav className="grid grid-cols-2 gap-4">
          <Link href="/map" className="bg-white p-4 rounded-xl shadow hover:bg-gray-50">Campus Map</Link>
          <Link href="/lost-and-found" className="bg-white p-4 rounded-xl shadow hover:bg-gray-50">Lost & Found</Link>
          <Link href="/marketplace" className="bg-white p-4 rounded-xl shadow hover:bg-gray-50">Student Marketplace</Link>
          <Link href="/academics" className="bg-white p-4 rounded-xl shadow hover:bg-gray-50">Academic Info Manager</Link>
          <Link href="/clubs" className="bg-white p-4 rounded-xl shadow hover:bg-gray-50">Clubs & Societies</Link>
        </nav>
      </main>
    </div>
    </ThemeProvider>
  );
}
