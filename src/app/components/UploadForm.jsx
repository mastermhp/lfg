
"use client"

import { useRef, useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { uploadFiles, updateContent, deleteContent } from "../../../actions/uploadActions"

export default function UploadForm({ initialContent = null, onClose, onContentUpdate, onContentDelete, onContentAdd }) {
  const formRef = useRef()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [permissions, setPermissions] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [documents, setDocuments] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialContent) {
      setIsEditing(true)
      setTitle(initialContent.title)
      setDescription(initialContent.description)
      setCategory(initialContent.category)
      setHashtags(
        Array.isArray(initialContent.hashtags) ? initialContent.hashtags.join(", ") : initialContent.hashtags || "",
      )
      setPermissions(
        Array.isArray(initialContent.permissions)
          ? initialContent.permissions.join(", ")
          : initialContent.permissions || "",
      )
      setThumbnail(initialContent.thumbnail || "")
      setImages(initialContent.images || [])
      setVideos(initialContent.videos || [])
      setDocuments(initialContent.documents || [])
    }
  }, [initialContent])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("hashtags", hashtags)
      formData.append("permissions", permissions)
      formData.append("thumbnail", thumbnail)
      formData.append("images", JSON.stringify(images))
      formData.append("videos", JSON.stringify(videos))
      formData.append("documents", JSON.stringify(documents))

      let res
      if (isEditing) {
        res = await updateContent(initialContent._id, formData)
      } else {
        res = await uploadFiles(formData)
      }

      if (res && res.success) {
        if (isEditing) {
          onContentUpdate({
            ...initialContent,
            ...res.content,
          })
        } else {
          onContentAdd(res.content)
        }
        onClose()
      } else {
        throw new Error(res.error || "Failed to process content")
      }
    } catch (error) {
      console.error(error)
      alert(isEditing ? "Failed to update content." : "Failed to upload content.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setIsLoading(true)
      try {
        const result = await deleteContent(initialContent._id)
        if (result.success) {
          onContentDelete(initialContent._id)
          onClose()
        } else {
          // throw new Error(result.error || "Failed to delete content")
          throw new Error("content deleted please reload")
        }
      } catch (error) {
        console.error("Error in handleDelete:", error)
        alert(`content deleted please reload`)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleAddLink = (type, link) => {
    switch (type) {
      case "image":
        setImages([...images, link])
        break
      case "video":
        setVideos([...videos, link])
        break
      case "document":
        setDocuments([...documents, link])
        break
      default:
        break
    }
  }

  const handleRemoveLink = (type, index) => {
    switch (type) {
      case "image":
        setImages(images.filter((_, i) => i !== index))
        break
      case "video":
        setVideos(videos.filter((_, i) => i !== index))
        break
      case "document":
        setDocuments(documents.filter((_, i) => i !== index))
        break
      default:
        break
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[hsl(var(--sidebar-bg))] rounded-lg w-full max-w-2xl p-6 border border-[hsl(var(--border))] shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{isEditing ? "Edit Content" : "Add New Content"}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          >
            <X className="w-6 h-6" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} ref={formRef} className="space-y-4 pb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="text"
            placeholder="Hashtags (comma-separated)"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="text"
            placeholder="Thumbnail (Google Drive link)"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Images</h3>
            {images.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="flex-grow px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink("image", index)}
                  className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add image link"
                className="flex-grow px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddLink("image", e.target.value)
                    e.target.value = ""
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousElementSibling
                  handleAddLink("image", input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Videos</h3>
            {videos.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="flex-grow px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink("video", index)}
                  className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add video link"
                className="flex-grow px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddLink("video", e.target.value)
                    e.target.value = ""
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousElementSibling
                  handleAddLink("video", input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Documents</h3>
            {documents.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="flex-grow px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink("document", index)}
                  className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add document link"
                className="flex-grow px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddLink("document", e.target.value)
                    e.target.value = ""
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousElementSibling
                  handleAddLink("document", input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Permissions (comma-separated user IDs)"
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[hsl(var(--sidebar-bg))]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </span>
              ) : (
                <span>{isEditing ? "Update Content" : "Add Content"}</span>
              )}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[hsl(var(--sidebar-bg))]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete Content"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

