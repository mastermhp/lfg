"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ImageIcon, Video, FileText, Download } from "lucide-react"
import Link from "next/link"
import { getGoogleDriveDirectUrl , isGoogleDriveUrl} from "../utils/googleDrive"


export default function ContentDetails({ content }) {
  const [hoveredImage, setHoveredImage] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [videoPreview, setVideoPreview] = useState(false)
  const [isGoogleDriveVideo, setIsGoogleDriveVideo] = useState(false)

  useEffect(() => {
    if (content?.videos?.length) {
      const url = isGoogleDriveUrl(content.videos[0])
        ? getGoogleDriveDirectUrl(content.videos[0], "video")
        : content.videos[0]
      setVideoUrl(url || null)
      setIsGoogleDriveVideo(isGoogleDriveUrl(content.videos[0]))
    }
  }, [content])

  const getUrl = (url, type = "view") => {
    if (!url) return null
    return isGoogleDriveUrl(url) ? getGoogleDriveDirectUrl(url, type) : url
  }

  const handleDownload = (url, filename) => {
    if (!url) return
    window.open(getUrl(url, "download"), "_blank")
  }

  const renderHashtags = () => {
    if (!content.hashtags) return null
    const tags = Array.isArray(content.hashtags)
      ? content.hashtags
      : content.hashtags.split(",")

    return tags.map((tag, index) => (
      <span key={index} className="bg-[#2a3447] px-2 py-1 rounded">
        #{tag.trim()}
      </span>
    ))
  }

  return (
    <div className="bg-[#1f2937] rounded-lg overflow-hidden">
      <div className="aspect-video h-[700px] relative bg-black">
        {content?.videos?.length > 0 ? (
          <div
            className="relative w-full h-full"
            onMouseEnter={() => setVideoPreview(true)}
            onMouseLeave={() => setVideoPreview(false)}
          >
            {videoPreview ? (
              isGoogleDriveVideo ? (
                <iframe
                  key={videoUrl}
                  src={videoUrl}
                  allow="autoplay"
                  className="w-full h-full object-cover"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  key={videoUrl}
                  muted
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <button
                onClick={() => setVideoPreview(true)}
                className="w-full h-full flex items-center justify-center text-white bg-gray-800"
              >
                <Video className="w-10 h-10" />
              </button>
            )}

            <button
              onClick={() => handleDownload(videoUrl, `video-${content.title || "download"}.mp4`)}
              className="absolute bottom-14 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              title="Download video"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : content?.thumbnail ? (
          <Image
            src={getUrl(content.thumbnail) || "/placeholder.svg"}
            alt={content.title || "Thumbnail"}
            layout="fill"
            objectFit="contain"
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            No video or thumbnail available
          </div>
        )}
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{content?.title}</h1>
        <p className="text-gray-400 mb-6">
          {content?.createdAt ? new Date(content.createdAt).toLocaleDateString() : "Date unknown"}
        </p>

        <div className="text-white">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="mb-4">{content?.description}</p>

          <h2 className="text-xl font-semibold mb-2">Category</h2>
          <p className="mb-4">{content?.category}</p>

          {content?.hashtags && (
            <>
              <h2 className="text-xl font-semibold mb-2">Hashtags</h2>
              <div className="flex flex-wrap gap-2 mb-4">{renderHashtags()}</div>
            </>
          )}

          {/* <h2 className="text-xl font-semibold mb-2">Files</h2>
          <div className="space-y-4">
            {content?.images?.map((image, index) => (
              <div
                key={`image-${index}`}
                className="relative group"
                onMouseEnter={() => setHoveredImage(image)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Link
                  href={getUrl(image)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#2a3447] text-white p-4 rounded flex items-center gap-3 hover:bg-gray-700"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="flex-1">View Image {index + 1}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleDownload(image, `image-${index + 1}.jpg`)
                    }}
                    className="p-2 hover:bg-gray-600 rounded-full transition-colors"
                    title="Download image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </Link>
                {hoveredImage === image && getUrl(image) && (
                  <div className="absolute z-10 left-0 bottom-full mb-2 w-48 h-32 bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={getUrl(image) || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
              </div>
            ))}

            {content?.documents?.map((doc, index) => (
              <Link
                key={`doc-${index}`}
                href={getUrl(doc)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#2a3447] text-white p-4 rounded flex items-center gap-3 hover:bg-gray-700"
              >
                <FileText className="w-5 h-5" />
                <span className="flex-1">View Document {index + 1}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleDownload(doc, `document-${index + 1}.pdf`)
                  }}
                  className="p-2 hover:bg-gray-600 rounded-full transition-colors"
                  title="Download document"
                >
                  <Download className="w-4 h-4" />
                </button>
              </Link>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  )
}


