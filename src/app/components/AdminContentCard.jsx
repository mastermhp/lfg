"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getGoogleDriveDirectUrl, isGoogleDriveUrl } from "../utils/googleDrive"
// import { getGoogleDriveDirectUrl, isGoogleDriveUrl } from "@/utils/googleDrive"


export default function AdminContentCard({ content, onContentSelect }) {
  const [isHovered, setIsHovered] = useState(false)

  const renderHashtags = () => {
    if (!content.hashtags) return null

    if (Array.isArray(content.hashtags)) {
      return content.hashtags.map((tag, index) => (
        <span key={index} className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded">
          #{tag.trim()}
        </span>
      ))
    }

    if (typeof content.hashtags === "string") {
      return content.hashtags.split(",").map((tag, index) => (
        <span key={index} className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded">
          #{tag.trim()}
        </span>
      ))
    }

    return null
  }

  const getThumbnailUrl = (url) => {
    if (!url) return "/placeholder.svg"
    return isGoogleDriveUrl(url) ? getGoogleDriveDirectUrl(url) : url
  }

  return (
    <div
      className="relative aspect-video rounded-lg overflow-hidden bg-[#1f2937]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={getThumbnailUrl(content.thumbnail) || "/placeholder.svg"}
        alt={content.title}
        width={400}
        height={225}
        className="w-full h-full object-cover"
      />

      {isHovered && (
        <div
          onClick={() => onContentSelect(content)}
          className="absolute inset-0 bg-black/80 p-4 flex flex-col justify-between transition-all duration-200"
        >
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{content.title}</h3>
            <div className="flex flex-wrap gap-2">{renderHashtags()}</div>
          </div>
          <Link
            href={`/content/${content._id}`}
            className="block w-full text-center bg-white text-black py-2 rounded hover:bg-gray-200 transition-colors"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  )
}

