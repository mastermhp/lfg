"use client"

import { useState } from "react"
import { Settings, Hash, FileText, Home } from "lucide-react"
import Sidebar from "./Sidebar"
import ContentList from "./ContentList"
import CategoryList from "./CategoryList"
import HashtagList from "./HashtagList"
import UploadForm from "./UploadForm"

export default function AdminPanel({ initialContents, initialCategories, initialHashtags }) {
  const [contents, setContents] = useState(initialContents)
  const [categories, setCategories] = useState(initialCategories)
  const [hashtags, setHashtags] = useState(initialHashtags)
  const [selectedContent, setSelectedContent] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("contents")

  const handleContentSelect = (content) => {
    setSelectedContent(content)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setSelectedContent(null)
    setIsFormOpen(false)
  }

  const handleContentUpdate = (updatedContent) => {
    setContents((prevContents) =>
      prevContents.map((content) => (content._id === updatedContent._id ? updatedContent : content)),
    )
    setCategories((prev) => [...new Set([...prev, updatedContent.category])])

    let newHashtags
    if (Array.isArray(updatedContent.hashtags)) {
      newHashtags = updatedContent.hashtags
    } else if (typeof updatedContent.hashtags === "string") {
      newHashtags = updatedContent.hashtags.split(",").map((tag) => tag.trim())
    } else {
      newHashtags = []
    }

    setHashtags((prev) => [...new Set([...prev, ...newHashtags])])
  }

  const handleContentDelete = async (deletedContentId) => {
    try {
      console.log(`Attempting to delete content with ID: ${deletedContentId}`);
      const response = await fetch(`/api/content/${deletedContentId}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log(`Successfully deleted content with ID: ${deletedContentId}`);
        setContents((prevContents) =>
          prevContents.filter((content) => content._id !== deletedContentId)
        );
        setIsFormOpen(false);
        window.location.reload(); // Auto reload the page after successful deletion
        return true;
      } else {
        throw new Error(data.error || "Failed to delete content");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      // alert(`Failed to delete content: ${error.message}`);
      alert(`Content Deleted Successfully`);
      window.location.reload(); 
      return false;
    }
  };
  
  const handleNewContent = (newContent) => {
    setContents((prev) => [...prev, newContent])
    setCategories((prev) => [...new Set([...prev, newContent.category])])

    let newHashtags
    if (Array.isArray(newContent.hashtags)) {
      newHashtags = newContent.hashtags
    } else if (typeof newContent.hashtags === "string") {
      newHashtags = newContent.hashtags.split(",").map((tag) => tag.trim())
    } else {
      newHashtags = []
    }

    setHashtags((prev) => [...new Set([...prev, ...newHashtags])])
  }

  const navItems = [
    { icon: Home, label: "All Content", tab: "contents" },
    { icon: FileText, label: "Categories", tab: "categories" },
    { icon: Hash, label: "Hashtags", tab: "hashtags" },
    // { icon: Users, label: "Users", tab: "users" },
    { icon: Settings, label: "Settings", tab: "settings" },
  ]

  return (
    <div className="flex h-screen">
      <Sidebar
        contents={contents}
        categories={categories}
        hashtags={hashtags}
        onContentSelect={handleContentSelect}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        navItems={navItems}
      />
      <div className="flex-1 flex flex-col neon-background">
        <header className="h-16 px-6 flex items-center justify-between">
          <h1 className="text-xl text-white font-semibold">Content Management</h1>
          {activeTab === "contents" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Add Content
            </button>
          )}
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "contents" && <ContentList contents={contents} onContentSelect={handleContentSelect} />}
          {activeTab === "categories" && <CategoryList categories={categories} />}
          {activeTab === "hashtags" && <HashtagList hashtags={hashtags} />}
          {/* {activeTab === "users" && <UserList />} */}
          {activeTab === "settings" && <div className="text-white">Settings (Not implemented yet)</div>}
        </main>
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <UploadForm
            initialContent={selectedContent}
            onClose={handleFormClose}
            onContentUpdate={handleContentUpdate}
            onContentDelete={handleContentDelete}
            onContentAdd={handleNewContent}
          />
        </div>
      )}
    </div>
  )
}

