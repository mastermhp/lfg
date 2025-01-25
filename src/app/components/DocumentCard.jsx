import React from "react";

export default function DocumentCard({ name, url }) {
  return (
    <div className="border border-gray-400 rounded p-2 mb-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        {name}
      </a>
    </div>
  );
}
