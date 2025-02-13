import { getAllFiles } from "../../../actions/uploadActions";
import ContentCard from "./ContentCard"

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default async function ContentGrid({ searchParams }) {
  const result = await getAllFiles()
  const contents = result.success ? result.contents : []

  let filteredContents = contents

  // Apply filters based on searchParams
  if (searchParams.search) {
    const searchQuery = searchParams.search.toLowerCase()
    filteredContents = filteredContents.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery) ||
        (item.hashtags &&
          (Array.isArray(item.hashtags)
            ? item.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.replace("#", "")))
            : typeof item.hashtags === "string" && item.hashtags.toLowerCase().includes(searchQuery.replace("#", "")))),
    )
  }

  if (searchParams.category && searchParams.category !== "All") {
    filteredContents = filteredContents.filter((item) => item.category === searchParams.category)
  }

  // Apply shuffle if requested (after filtering, before sorting)
  if (searchParams.shuffle === "true") {
    filteredContents = shuffleArray([...filteredContents])
  }

  // Apply sorting (only if not shuffled)
  if (searchParams.sort && searchParams.shuffle !== "true") {
    switch (searchParams.sort) {
      case "Newest":
        filteredContents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "Oldest":
        filteredContents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case "Most Viewed":
        filteredContents.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case "Most Liked":
        filteredContents.sort((a, b) => (b.likes || 0) - (a.likes || 0))
        break
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContents.map((item) => (
        <ContentCard key={item._id} content={item} />
      ))}
    </div>
  )
}

