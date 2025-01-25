// import AdminPanel from "@/components/AdminPanel"
import { getAllFiles, getAllCategories, getAllHashtags } from "../../../actions/uploadActions"
import AdminPanel from "../components/AdminPanel"
// import { getAllFiles, getAllCategories, getAllHashtags } from "@/actions/uploadActions"

export default async function AdminPage() {
  const { contents } = await getAllFiles()
  const { categories } = await getAllCategories()
  const { hashtags } = await getAllHashtags()

  return <AdminPanel initialContents={contents} initialCategories={categories} initialHashtags={hashtags} />
}

