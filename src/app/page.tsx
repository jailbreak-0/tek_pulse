"use client";
import Head from "next/head";
import Link from "next/link";
import SupabaseImage from "@/components/Images";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { userData, loading } = useUser();
  if (loading) return <p>Loading...</p>;

  return (

      <div className="min-h-screen bg-gray-900 p-4">
        <Head>
          <title>TekPulse</title>
        </Head>
        <main className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[#22AB39] text-center">
              Welcome to TekPulse
            </h1>
          <div className="flex flex-col justify-center mb-10">
            {userData?.profile_picture ? (
            <SupabaseImage
              path={userData?.profile_picture}
              bucket="pictures/image"
              isPublic={true}
              className="absolute rounded-full border"
            />
            ) : (
            <div className="w-20 h-20 absolute bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              No image
            </div>
            )}
            <div className="px-25 items-center">
              <h3>Full Name: {userData?.full_name}</h3>
              <p>Student Number: {userData?.student_id}</p>
            </div>
          </div>

          <nav className="flex justify-between gap-2">
            <div className="flex flex-col items-center text-yellow-500 bg-white px-auto py-10 rounded-xl shadow hover:bg-gray-50 w-52 h-auto">
              <Link href="/feed" className="text-center w-full h-full">
                <SupabaseImage 
                  path="err404.jpg"
                  bucket="pictures/image"
                  isPublic={true}
                  alt="map"
                  className="relative mx-auto mb-1 w-30 h-30"
                />
                Social Feed
              </Link>
            </div>
            <div className="flex flex-col items-center text-yellow-500 bg-white px-auto py-10 rounded-xl shadow hover:bg-gray-50 w-52 h-auto">
              <Link href="/map" className="text-center w-full h-full">
                <SupabaseImage 
                  path="err404.jpg"
                  bucket="pictures/image"
                  isPublic={true}
                  alt="map"
                  className="relative mx-auto mb-1 w-30 h-30"
                />
                Campus Map
              </Link>
            </div>
            <div className="flex flex-col items-center text-yellow-500 bg-white px-auto py-10 rounded-xl shadow hover:bg-gray-50 w-52 h-64">
              <Link href="/lost-and-found" className="text-center">
              <SupabaseImage 
                  path="err404.jpg"
                  bucket="pictures/image"
                  isPublic={true}
                  alt="map"
                  className="relative mx-auto mb-1 w-30 h-30"
                />
                Lost & Found
              </Link>
            </div>
            <div className="flex flex-col items-center text-yellow-500 bg-white px-auto py-10 rounded-xl shadow hover:bg-gray-50 w-52 h-64">
              <Link href="/marketplace" className="text-center">
              <SupabaseImage 
                  path="err404.jpg"
                  bucket="pictures/image"
                  isPublic={true}
                  alt="map"
                  className="relative mx-auto mb-1 w-30 h-30"
                />
                Student Marketplace
              </Link>
            </div>
            <div className="flex flex-col items-center text-yellow-500 bg-white px-auto py-10 rounded-xl shadow hover:bg-gray-50 w-52 h-64">
              <Link href="/academics" className="text-center">
              <SupabaseImage 
                  path="err404.jpg"
                  bucket="pictures/image"
                  isPublic={true}
                  alt="map"
                  className="relative mx-auto mb-1 w-30 h-30"
                />
                Academic Info Manager
              </Link>
            </div>
            <div className="flex flex-col items-center text-yellow-500 bg-white px-auto py-10 rounded-xl shadow hover:bg-gray-50 w-52 h-64">
              <Link href="/clubs" className="text-center">
              <SupabaseImage 
                  path="err404.jpg"
                  bucket="pictures/image"
                  isPublic={true}
                  alt="map"
                  className="relative mx-auto mb-1 w-30 h-30"
                />
                Clubs & Societies
              </Link>
            </div>
          </nav>
        </main>
      </div>
  );
}
