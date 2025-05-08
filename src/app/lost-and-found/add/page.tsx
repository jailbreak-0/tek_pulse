"use client";

import LostFoundForm from "@/components/LostFoundForm";
import { ArrowLeft } from "lucide-react";

export default function AddLostFoundPage() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
        <nav className="mb-4">
            <a
                href="../lost-and-found"
                className="hover:text-[#22AB39] flex items-center"
            >  
                <ArrowLeft className="inline mr-2" strokeWidth={4} size={16} />
                <span className="font-semibold">Back</span>
            </a>
        </nav>
      <h1 className="text-2xl font-bold mb-4">Report Lost or Found Item</h1>
      <LostFoundForm />
    </div>
  );
}
