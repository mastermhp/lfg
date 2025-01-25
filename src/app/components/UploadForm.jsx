
"use client"

import React, { useRef, useState, useEffect } from "react"
import PhotoCard from "./PhotoCard"
import VideoCard from "./VideoCard"
import DocumentCard from "./DocumentCard"
import { X, Loader2 } from "lucide-react"
import { uploadFiles, updateContent, deleteContent  } from "../../../actions/uploadActions"

export default function UploadForm({ initialContent = null, onClose, onContentUpdate, onContentDelete, onContentAdd }) {
  const formRef = useRef()
  const [files, setFiles] = useState([])
  const [videos, setVideos] = useState([])
  const [documents, setDocuments] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [permissions, setPermissions] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialContent) {
      setIsEditing(true)
      setTitle(initialContent.title)
      setDescription(initialContent.description)
      setCategory(initialContent.category)
      setHashtags(initialContent.hashtags)
      setPermissions(initialContent.permissions)
    }
  }, [initialContent])

  async function handleInputFiles(e) {
    const selectedFiles = e.target.files
    const validFiles = [...selectedFiles].filter((file) => {
      return file.size < 1024 * 1024 * 1000 && file.type.startsWith("image/")
    })
    if (validFiles.length === 0) {
      alert("No valid image files were selected. Ensure they are images under 5MB.")
      return
    }
    setFiles((prev) => [...validFiles, ...prev])
  }

  async function handleInputVideos(e) {
    const selectedFiles = e.target.files
    const validVideos = [...selectedFiles].filter((file) => {
      return file.size < 1024 * 1024 * 3000 && file.type.startsWith("video/")
    })
    if (validVideos.length === 0) {
      alert("No valid video files were selected. Ensure they are videos under 20MB.")
      return
    }
    setVideos((prev) => [...validVideos, ...prev])
  }

  async function handleInputDocuments(e) {
    const selectedFiles = e.target.files
    const validDocuments = [...selectedFiles].filter((file) => {
      return (
        file.size < 1024 * 1024 * 10 &&
        (file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/vnd.ms-excel" ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      )
    })
    if (validDocuments.length === 0) {
      alert("No valid documents were selected. Supported formats: PDF, Word, Excel (max 10MB).")
      return
    }
    setDocuments((prev) => [...validDocuments, ...prev])
  }

  async function handleDeleteFiles(index) {
    const validFiles = files.filter((_, i) => i !== index)
    setFiles(validFiles)
  }

  async function handleDeleteVideos(index) {
    const validVideos = videos.filter((_, i) => i !== index)
    setVideos(validVideos)
  }

  async function handleDeleteDocuments(index) {
    const validDocuments = documents.filter((_, i) => i !== index)
    setDocuments(validDocuments)
  }

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

      files.forEach((file) => formData.append("images", file))
      videos.forEach((video) => formData.append("videos", video))
      documents.forEach((doc) => formData.append("documents", doc))

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
            title,
            description,
            category,
            hashtags,
            permissions,
            images: [...(initialContent.images || []), ...files.map((f) => URL.createObjectURL(f))],
            videos: [...(initialContent.videos || []), ...videos.map((v) => URL.createObjectURL(v))],
            documents: [...(initialContent.documents || []), ...documents.map((d) => d.name)],
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
    if (isEditing && initialContent) {
      setIsLoading(true)
      try {
        const res = await deleteContent(initialContent._id)
        if (res.success) {
          onContentDelete(initialContent._id)
          onClose()
        } else {
          throw new Error(res.error || "Failed to delete content")
        }
      } catch (error) {
        console.error(error)
        alert("Failed to delete content.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-[hsl(var(--sidebar-bg))] rounded-lg w-full max-w-2xl p-6 border border-[hsl(var(--border))] shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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

          <div className="space-y-2">
            <label className="block text-lg font-medium text-white">Thumbnail</label>
            <div
              className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => document.getElementById("thumbnail-upload").click()}
            >
              <p className="text-gray-400">Drag 'n' drop a thumbnail image here, or click to select one</p>
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleInputFiles}
                className="hidden"
              />
            </div>
          </div>

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

          <div className="space-y-2">
            <label className="block text-lg font-medium text-white">Images</label>
            <div
              className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => document.getElementById("images-upload").click()}
            >
              <p className="text-gray-400">Drag 'n' drop some images here, or click to select files</p>
              <input
                id="images-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleInputFiles}
                className="hidden"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {files.map((file, index) => (
                <PhotoCard key={index} url={URL.createObjectURL(file)} onClick={() => handleDeleteFiles(index)} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-white">Videos</label>
            <div
              className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => document.getElementById("videos-upload").click()}
            >
              <p className="text-gray-400">Drag 'n' drop some videos here, or click to select files</p>
              <input
                id="videos-upload"
                type="file"
                accept="video/*"
                multiple
                onChange={handleInputVideos}
                className="hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {videos.map((video, index) => (
                <VideoCard key={index} url={URL.createObjectURL(video)} onClick={() => handleDeleteVideos(index)} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-white">Documents</label>
            <div
              className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => document.getElementById("documents-upload").click()}
            >
              <p className="text-gray-400">Drag 'n' drop some documents here, or click to select files</p>
              <input
                id="documents-upload"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple
                onChange={handleInputDocuments}
                className="hidden"
              />
            </div>
            <div className="mt-4">
              {documents.map((doc, index) => (
                <DocumentCard key={index} name={doc.name} onClick={() => handleDeleteDocuments(index)} />
              ))}
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