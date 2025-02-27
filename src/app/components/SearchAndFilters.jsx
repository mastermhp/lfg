"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Hash, Shuffle, ChevronDown } from "lucide-react"
import { getAllCategories, getAllHashtags } from "../../../actions/uploadActions"

export default function SearchAndFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("category") || "All")
  const [selectedSort, setSelectedSort] = useState(searchParams?.get("sort") || "Newest")
  const [isHashtagsOpen, setIsHashtagsOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [categories, setCategories] = useState(["All"])
  const [hashtags, setHashtags] = useState([])

  const sortOptions = ["Newest", "Oldest", "Most Viewed", "Most Liked"]

  useEffect(() => {
    const fetchCategoriesAndHashtags = async () => {
      const categoriesResult = await getAllCategories()
      const hashtagsResult = await getAllHashtags()

      if (categoriesResult.success) {
        setCategories(["All", ...categoriesResult.categories])
      }

      if (hashtagsResult.success) {
        setHashtags(hashtagsResult.hashtags)
      }
    }

    fetchCategoriesAndHashtags()
  }, [])

  useEffect(() => {
    if (!searchParams) return

    const params = new URLSearchParams(searchParams)
    if (searchQuery) params.set("search", searchQuery)
    else params.delete("search")
    if (selectedCategory !== "All") params.set("category", selectedCategory)
    else params.delete("category")
    params.set("sort", selectedSort)
    router.push(`?${params.toString()}`)
  }, [searchQuery, selectedCategory, selectedSort, router, searchParams])

  const handleShuffleContent = () => {
    const params = new URLSearchParams(searchParams)
    params.set("shuffle", "true")
    params.delete("sort") // Remove sorting when shuffling
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 z-20">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1f2937] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e74c3c]"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setIsHashtagsOpen(!isHashtagsOpen)}
              className="px-4 py-2 bg-[#1f2937] text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Hash className="w-4 h-4" />
              Hashtags
            </button>
            {isHashtagsOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1f2937] border border-gray-700 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search hashtags..."
                    className="w-full px-2 py-1 bg-[#2d3748] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#e74c3c]"
                  />
                </div>
                <div className="max-h-48 z-50 overflow-y-auto">
                  {hashtags.map((hashtag) => (
                    <button
                      key={hashtag}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                      onClick={() => {
                        setSearchQuery(`#${hashtag}`)
                        setIsHashtagsOpen(false)
                      }}
                    >
                      #{hashtag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleShuffleContent}
            className="px-4 py-2 bg-[#1f2937] text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </button>
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-4 py-2 bg-[#1f2937] text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              {selectedSort}
              <ChevronDown className="w-4 h-4" />
            </button>
            {isSortOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1f2937] border border-gray-700 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                    onClick={() => {
                      setSelectedSort(option)
                      setIsSortOpen(false)
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg border ${
              selectedCategory === category
                ? "bg-[#e74c3c] text-white border-[#e74c3c]"
                : "bg-[#1f2937] text-white border-gray-700 hover:bg-gray-700"
            }`}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

