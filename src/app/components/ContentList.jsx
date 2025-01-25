import React, { useState } from "react";
import ContentCard from "./ContentCard";
import Image from "next/image";
import AdminContentCard from "./AdminContentCard";

export default function ContentList({ contents, onContentSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contents.map((content) => (
       
        <AdminContentCard onContentSelect={onContentSelect} key={content._id} content={content} />
        // <div
        //   key={content._id}
        //   className="bg-slate-800 p-4 rounded shadow cursor-pointer hover:shadow-lg"
        //   onClick={() => onContentSelect(content)}
        // >
        //   <h3 className="text-xl font-bold mb-2">{content.title}</h3>
        //   <p className="text-gray-600">
        //     {content.description.substring(0, 100)}...
        //   </p>
        //   <p className="text-sm text-gray-500 mt-2">
        //     Category: {content.category}
        //   </p>
        
        // </div>
      ))}
    </div>
  );
}
