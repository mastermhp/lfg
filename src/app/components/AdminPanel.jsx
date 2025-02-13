// "use client"

// import { useState } from "react"
// import { Settings, Hash, FileText, Home } from "lucide-react"
// import Sidebar from "./Sidebar"
// import ContentList from "./ContentList"
// import CategoryList from "./CategoryList"
// import HashtagList from "./HashtagList"
// import UploadForm from "./UploadForm"

// export default function AdminPanel({ initialContents, initialCategories, initialHashtags }) {
//   const [contents, setContents] = useState(initialContents)
//   const [categories, setCategories] = useState(initialCategories)
//   const [hashtags, setHashtags] = useState(initialHashtags)
//   const [selectedContent, setSelectedContent] = useState(null)
//   const [isFormOpen, setIsFormOpen] = useState(false)
//   const [activeTab, setActiveTab] = useState("contents")

//   const handleContentSelect = (content) => {
//     setSelectedContent(content)
//     setIsFormOpen(true)
//   }

//   const handleFormClose = () => {
//     setSelectedContent(null)
//     setIsFormOpen(false)
//   }

//   const handleContentUpdate = (updatedContent) => {
//     setContents((prevContents) =>
//       prevContents.map((content) => (content._id === updatedContent._id ? updatedContent : content)),
//     )
//     setCategories((prev) => [...new Set([...prev, updatedContent.category])])

//     let newHashtags
//     if (Array.isArray(updatedContent.hashtags)) {
//       newHashtags = updatedContent.hashtags
//     } else if (typeof updatedContent.hashtags === "string") {
//       newHashtags = updatedContent.hashtags.split(",").map((tag) => tag.trim())
//     } else {
//       newHashtags = []
//     }

//     setHashtags((prev) => [...new Set([...prev, ...newHashtags])])
//   }

//   const handleContentDelete = async (deletedContentId) => {
//     try {
//       console.log(`Attempting to delete content with ID: ${deletedContentId}`);
//       const response = await fetch(`/api/content/${deletedContentId}`, {
//         method: "DELETE",
//       });
  
//       const data = await response.json();
  
//       if (data.success) {
//         console.log(`Successfully deleted content with ID: ${deletedContentId}`);
//         setContents((prevContents) =>
//           prevContents.filter((content) => content._id !== deletedContentId)
//         );
//         setIsFormOpen(false);
//         window.location.reload(); // Auto reload the page after successful deletion
//         return true;
//       } else {
//         throw new Error(data.error || "Failed to delete content");
//       }
//     } catch (error) {
//       console.error("Error deleting content:", error);
//       // alert(`Failed to delete content: ${error.message}`);
//       alert(`Content Deleted Successfully`);
//       window.location.reload(); 
//       return false;
//     }
//   };
  
//   const handleNewContent = (newContent) => {
//     setContents((prev) => [...prev, newContent])
//     setCategories((prev) => [...new Set([...prev, newContent.category])])

//     let newHashtags
//     if (Array.isArray(newContent.hashtags)) {
//       newHashtags = newContent.hashtags
//     } else if (typeof newContent.hashtags === "string") {
//       newHashtags = newContent.hashtags.split(",").map((tag) => tag.trim())
//     } else {
//       newHashtags = []
//     }

//     setHashtags((prev) => [...new Set([...prev, ...newHashtags])])
//   }

//   const navItems = [
//     { icon: Home, label: "All Content", tab: "contents" },
//     { icon: FileText, label: "Categories", tab: "categories" },
//     { icon: Hash, label: "Hashtags", tab: "hashtags" },
//     // { icon: Users, label: "Users", tab: "users" },
//     { icon: Settings, label: "Settings", tab: "settings" },
//   ]

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         contents={contents}
//         categories={categories}
//         hashtags={hashtags}
//         onContentSelect={handleContentSelect}
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//         navItems={navItems}
//       />
//       <div className="flex-1 flex flex-col neon-background">
//         <header className="h-16 px-6 flex items-center justify-between">
//           <h1 className="text-xl text-white font-semibold">Content Management</h1>
//           {activeTab === "contents" && (
//             <button
//               onClick={() => setIsFormOpen(true)}
//               className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-600 transition-colors"
//             >
//               Add Content
//             </button>
//           )}
//         </header>
//         <main className="flex-1 p-6 overflow-auto">
//           {activeTab === "contents" && <ContentList contents={contents} onContentSelect={handleContentSelect} />}
//           {activeTab === "categories" && <CategoryList categories={categories} />}
//           {activeTab === "hashtags" && <HashtagList hashtags={hashtags} />}
//           {/* {activeTab === "users" && <UserList />} */}
//           {activeTab === "settings" && <div className="text-white">Settings (Not implemented yet)</div>}
//         </main>
//       </div>
//       {isFormOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <UploadForm
//             initialContent={selectedContent}
//             onClose={handleFormClose}
//             onContentUpdate={handleContentUpdate}
//             onContentDelete={handleContentDelete}
//             onContentAdd={handleNewContent}
//           />
//         </div>
//       )}
//     </div>
//   )
// }




"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  PlusCircle,
  FileText,
  Hash,
  Grid,
  Settings,
  Trash2,
  Edit,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getAllFiles,
  getAllCategories,
  getAllHashtags,
  deleteContent,
} from "../../../actions/uploadActions";
import UploadForm from "../components/UploadForm";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  getGoogleDriveDirectUrl,
  isGoogleDriveUrl,
} from "../utils/googleDrive";

// Note: Ensure you've added the neon red theme to your tailwind.config.js

function AdminPanel() {
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [activeSection, setActiveSection] = useState("contents");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contentsResult, categoriesResult, hashtagsResult] =
        await Promise.all([
          getAllFiles(),
          getAllCategories(),
          getAllHashtags(),
        ]);

      if (contentsResult.success) setContents(contentsResult.contents);
      if (categoriesResult.success) setCategories(categoriesResult.categories);
      if (hashtagsResult.success) setHashtags(hashtagsResult.hashtags);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContentAdd = (newContent) => {
    setContents([...contents, newContent]);
    toast({
      title: "Success",
      description: "Content added successfully.",
    });
  };

  const handleContentUpdate = (updatedContent) => {
    setContents(
      contents.map((content) =>
        content._id === updatedContent._id ? updatedContent : content
      )
    );
    toast({
      title: "Success",
      description: "Content updated successfully.",
    });
  };

  const handleContentDelete = async (contentId) => {
    try {
      const result = await deleteContent(contentId);
      if (result.success) {
        setContents(contents.filter((content) => content._id !== contentId));
        toast({
          title: "Success",
          description: "Content deleted successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const filteredContents = contents.filter(
    (content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getThumbnailUrl = (url) => {
    if (!url) return "/placeholder.svg";
    return isGoogleDriveUrl(url) ? getGoogleDriveDirectUrl(url) : url;
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "contents":
        return (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredContents.map((content, index) => (
              <motion.div
                key={content._id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-neonRed-400/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-video relative overflow-hidden">
                  {/* <Image
                    src={
                      isGoogleDriveUrl(content.thumbnailUrl)
                        ? getGoogleDriveDirectUrl(content.thumbnailUrl)
                        : content.thumbnailUrl
                    }
                    alt={content.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-110"
                  /> */}
                  <Image
                    src={
                      getThumbnailUrl(content.thumbnail) || "/placeholder.svg"
                    }
                    alt={content.title}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold admin-neon-text mb-2 transition-colors duration-300 group-hover:admin-neon-text">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {content.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setSelectedContent(content);
                          setIsUploadFormOpen(true);
                        }}
                        className="bg-neonRed-800 hover:bg-neonRed-700 text-white transition-transform duration-300 hover:scale-105"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setContentToDelete(content);
                          setIsDeleteDialogOpen(true);
                        }}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 transition-transform duration-300 hover:scale-105"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-neonRed-800 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {content.category}
                </div>
              </motion.div>
            ))}
          </motion.div>
        );
      case "categories":
        return (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category}
                className="p-4 border border-neonRed-100 rounded-lg bg-neonRed-50 shadow-neon"
              >
                <span className="text-neonRed-800">{category}</span>
              </div>
            ))}
          </div>
        );
      case "hashtags":
        return (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag) => (
              <span
                key={hashtag}
                className="px-3 py-1 text-sm bg-neonRed-800 text-white rounded-full shadow-neon"
              >
                #{hashtag}
              </span>
            ))}
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neonRed-100">
              Website Settings
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border border-neonRed-400 rounded-lg bg-neonRed-50 shadow-neon">
                <h3 className="font-bold text-neonRed-700 mb-2">Site Title</h3>
                <Input
                  placeholder="Enter site title"
                  className="border-neonRed-400 focus:ring-neonRed-500"
                />
              </div>
              <div className="p-4 border border-neonRed-400 rounded-lg bg-neonRed-50 shadow-neon">
                <h3 className="font-bold text-neonRed-700 mb-2">
                  Site Description
                </h3>
                <Input
                  placeholder="Enter site description"
                  className="border-neonRed-400 focus:ring-neonRed-500"
                />
              </div>
              <div className="p-4 border border-neonRed-400 rounded-lg bg-neonRed-50 shadow-neon">
                <h3 className="font-bold text-neonRed-700 mb-2">
                  Contact Email
                </h3>
                <Input
                  type="email"
                  placeholder="Enter contact email"
                  className="border-neonRed-400 focus:ring-neonRed-500"
                />
              </div>
              <div className="p-4 border border-neonRed-400 rounded-lg bg-neonRed-50 shadow-neon">
                <h3 className="font-bold text-neonRed-700 mb-2">
                  Social Media Links
                </h3>
                <Input
                  placeholder="Facebook URL"
                  className="mb-2 border-neonRed-400 focus:ring-neonRed-500"
                />
                <Input
                  placeholder="Twitter URL"
                  className="mb-2 border-neonRed-400 focus:ring-neonRed-500"
                />
                <Input
                  placeholder="Instagram URL"
                  className="border-neonRed-400 focus:ring-neonRed-500"
                />
              </div>
            </div>
            <Button className="bg-neonRed-500 hover:bg-neonRed-600 text-white">
              Save Settings
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen neon-background w-full px-44">
        <Sidebar className="bg-[#1c2333]">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="text-rose-800 font-bold"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-black">
                Content Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("contents")}
                      isActive={activeSection === "contents"}
                      className="text-rose-800 font-bold hover:text-white hover:bg-neonRed-800"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      All Contents
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("categories")}
                      isActive={activeSection === "categories"}
                      className="text-rose-800 font-bold hover:text-white hover:bg-neonRed-800"
                    >
                      <Grid className="w-4 h-4 mr-2" />
                      All Categories
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("hashtags")}
                      isActive={activeSection === "hashtags"}
                      className="text-rose-800 font-bold hover:text-white hover:bg-neonRed-800"
                    >
                      <Hash className="w-4 h-4 mr-2" />
                      All Hashtags
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-800">
                Admin
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("settings")}
                      isActive={activeSection === "settings"}
                      className="text-rose-800 hover:bg-neonRed-800"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="flex items-center justify-between p-4 text-white">
            <SidebarTrigger className="text-neonRed-100" />
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-neonRed-100 border-neonRed-700 text-rose-700 placeholder-neonRed-800 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neonRed-800" />
              </div>
              <Button
                onClick={() => setIsUploadFormOpen(true)}
                className="bg-neonRed-700 hover:bg-neonRed-800"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>
          </header>
          <main className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-neonRed-700">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            {renderMainContent()}
          </main>
        </div>
      </div>
      {isUploadFormOpen && (
        <UploadForm
          initialContent={selectedContent}
          onClose={() => {
            setIsUploadFormOpen(false);
            setSelectedContent(null);
          }}
          onContentAdd={handleContentAdd}
          onContentUpdate={handleContentUpdate}
          onContentDelete={handleContentDelete}
        />
      )}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleContentDelete(contentToDelete._id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );


  
}

export default AdminPanel;

