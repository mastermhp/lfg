import Image from "next/image";
import React from "react";
import { X } from "lucide-react";

export default function PhotoCard({ url, onClick }) {
  return (
    <div className="">
      <button type="button" onClick={onClick} className="border-2 border-red-700 p-1 mb-2 rounded-full">
        <X className="h-4 w-4 text-red-700" />
      </button>
      <div className="border-2 w-[120px] h-[100px] border-slate-400 rounded-[10px]">
        <Image
          src={url}
          alt="image"
          width={100}
          height={100}
          priority
          className="w-full h-full object-cover p-1 rounded-[10px]"
        />
      </div>
    </div>
  );
}
