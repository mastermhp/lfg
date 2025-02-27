
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getContentById } from "../../../../actions/uploadActions"
import ContentDetails from "@/app/components/ContentDetails"

export default async function ContentDetailPage({ params }) {
    const result = await getContentById(params.id)
    const content = result.success ? result.content : null
  
    if (!content) {
      return (
        <div className="min-h-screen bg-[#121827]">
          {/* <Header /> */}
          <div className="text-white text-center py-12">Content not found</div>
        </div>
      )
    }
  
    return (
      <div className="min-h-screen neon-background">  
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center text-[#e74c3c] hover:text-[#c0392b] mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalogue
          </Link>
  
          <ContentDetails content={content} />
        </main>

      </div>
    )
  }
  
  