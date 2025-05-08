import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from '@/context/ThemeContext';
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TekPulse",
  description: "CS Final Year Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 

{
  return (
    <html lang="en">
      <title>TekPulse</title>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <UserProvider>
            <Navbar />
            <main>{children}</main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
