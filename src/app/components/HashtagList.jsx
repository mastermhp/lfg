import React from "react"

export default function HashtagList({ hashtags }) {
  return (
    <div className="flex flex-wrap gap-2">
      {hashtags.map((hashtag) => (
        <div key={hashtag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          #{hashtag}
        </div>
      ))}
    </div>
  )
}

