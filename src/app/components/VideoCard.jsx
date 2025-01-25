import { X } from "lucide-react";
import React from "react";

export default function VideoCard({ url, onClick }) {
  return (
    <div className="">
      <button type="button" onClick={onClick} className="border-2 border-red-700 p-1 mb-2 rounded-full">
        <X className="h-4 w-4 text-red-700" />
      </button>
      <div className="border border-gray-400 h-[150px] rounded p-2">
        <video controls className="w-full h-full object-cover">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
     
    </div>
  );
}
