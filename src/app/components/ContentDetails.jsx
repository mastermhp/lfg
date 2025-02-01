import Image from "next/image"
import { ImageIcon, Video, FileText } from "lucide-react"

export default function ContentDetails({ content }) {
  const renderHashtags = () => {
    if (!content.hashtags) return null

    if (Array.isArray(content.hashtags)) {
      return content.hashtags.map((tag, index) => (
        <span key={index} className="bg-[#2a3447] px-2 py-1 rounded">
          #{tag.trim()}
        </span>
      ))
    }

    if (typeof content.hashtags === "string") {
      return content.hashtags.split(",").map((tag, index) => (
        <span key={index} className="bg-[#2a3447] px-2 py-1 rounded">
          #{tag.trim()}
        </span>
      ))
    }

    return null
  }

  return (
    <div className="bg-[#1f2937] rounded-lg overflow-hidden">
      <div className="aspect-video relative">
        <Image src={content.thumbnail || "/placeholder.svg"} alt={content.title} fill className="object-cover" />
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{content.title}</h1>
        <p className="text-gray-400 mb-6">
          {content.createdAt ? new Date(content.createdAt).toLocaleDateString() : "Date unknown"}
        </p>

        <div className="text-white">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="mb-4">{content.description}</p>

          <h2 className="text-xl font-semibold mb-2">Category</h2>
          <p className="mb-4">{content.category}</p>

          {content.hashtags && (
            <>
              <h2 className="text-xl font-semibold mb-2">Hashtags</h2>
              <div className="flex flex-wrap gap-2 mb-4">{renderHashtags()}</div>
            </>
          )}

          <h2 className="text-xl font-semibold mb-2">Files</h2>
          <div className="space-y-4">
            {content.images &&
              content.images.map((image, index) => (
                <a
                  key={`image-${index}`}
                  href={image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#2a3447] text-white p-4 rounded flex items-center gap-3 hover:bg-gray-700"
                >
                  <ImageIcon className="w-5 h-5" />
                  View Image {index + 1}
                </a>
              ))}

            {content.videos &&
              content.videos.map((video, index) => (
                <a
                  key={`video-${index}`}
                  href={video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#2a3447] text-white p-4 rounded flex items-center gap-3 hover:bg-gray-700"
                >
                  <Video className="w-5 h-5" />
                  Watch Video {index + 1}
                </a>
              ))}

            {content.documents &&
              content.documents.map((doc, index) => (
                <a
                  key={`doc-${index}`}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#2a3447] text-white p-4 rounded flex items-center gap-3 hover:bg-gray-700"
                >
                  <FileText className="w-5 h-5" />
                  View Document {index + 1}
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

