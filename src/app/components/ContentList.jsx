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
      ))}
    </div>
  );
}
