import { connectToDatabase } from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"


export default async function handler(req, res) {
    if (req.method === "DELETE") {
      try {
        const { id } = req.query
        console.log(`Attempting to delete content with ID: ${id}`)
  
        const { db } = await connectToDatabase()
  
        // First, check if the content exists
        const content = await db.collection("contents").findOne({ _id: new ObjectId(id) })
  
        if (!content) {
          console.log(`No content found with ID: ${id}`)
          return res.status(404).json({ success: false, message: "Content not found. It may have been already deleted." })
        }
  
        // If content exists, proceed with deletion
        const result = await db.collection("contents").deleteOne({ _id: new ObjectId(id) })
  
        console.log(`Delete result:`, result)
  
        if (result.deletedCount === 0) {
          console.log(`Failed to delete content with ID: ${id}`)
          return res.status(500).json({ success: false, message: "Failed to delete content. Please try again." })
        }
  
        console.log(`Successfully deleted content with ID: ${id}`)
        res.status(200).json({ success: true, message: "Content deleted successfully" })
      } catch (error) {
        console.error("Error in delete content API:", error)
        res.status(500).json({ success: false, message: error.message || "An unexpected error occurred" })
      }
    } else {
      res.setHeader("Allow", ["DELETE"])
      res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` })
    }
  }
  
  