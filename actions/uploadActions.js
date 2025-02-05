
"use server"

import { connectToDatabase } from "../lib/mongodb"
import { ObjectId } from "mongodb"
import { clerkClient } from "@clerk/clerk-sdk-node"

export async function getContentById(id) {
  try {
    const { db } = await connectToDatabase()
    const content = await db.collection("contents").findOne({ _id: new ObjectId(id) })
    if (!content) {
      return { success: false, error: "Content not found" }
    }
    return {
      success: true,
      content: {
        ...content,
        _id: content._id.toString(),
        createdAt: content.createdAt ? content.createdAt.toISOString() : null,
      },
    }
  } catch (error) {
    console.error("Error fetching content:", error)
    return { success: false, error: error.message }
  }
}

export async function uploadFiles(formData) {
  try {
    const { db } = await connectToDatabase()

    const contentData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      hashtags: formData
        .get("hashtags")
        .split(",")
        .map((tag) => tag.trim()),
      permissions: formData
        .get("permissions")
        .split(",")
        .map((id) => id.trim()),
      thumbnail: formData.get("thumbnail") || null,
      images: JSON.parse(formData.get("images") || "[]"),
      videos: JSON.parse(formData.get("videos") || "[]"),
      documents: JSON.parse(formData.get("documents") || "[]"),
      createdAt: new Date(),
    }

    // Ensure non-empty arrays for media
    if (!contentData.images.length) delete contentData.images
    if (!contentData.videos.length) delete contentData.videos
    if (!contentData.documents.length) delete contentData.documents

    const result = await db.collection("contents").insertOne(contentData)

    return {
      success: true,
      message: "Content uploaded successfully",
      content: { ...contentData, _id: result.insertedId.toString() },
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function updateContent(id, formData) {
  try {
    const { db } = await connectToDatabase()

    const contentData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      hashtags: formData
        .get("hashtags")
        .split(",")
        .map((tag) => tag.trim()),
      permissions: formData
        .get("permissions")
        .split(",")
        .map((id) => id.trim()),
      thumbnail: formData.get("thumbnail") || null,
      images: JSON.parse(formData.get("images") || "[]"),
      videos: JSON.parse(formData.get("videos") || "[]"),
      documents: JSON.parse(formData.get("documents") || "[]"),
      updatedAt: new Date(),
    }

    // Ensure non-empty arrays for media
    if (!contentData.images.length) delete contentData.images
    if (!contentData.videos.length) delete contentData.videos
    if (!contentData.documents.length) delete contentData.documents

    const result = await db.collection("contents").updateOne({ _id: new ObjectId(id) }, { $set: contentData })

    if (result.matchedCount === 0) {
      return { success: false, error: "Content not found" }
    }

    return {
      success: true,
      message: "Content updated successfully",
      content: contentData,
    }
  } catch (error) {
    console.error("Error updating content:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteContent(id) {
  try {
    console.log(`Attempting to delete content with id: ${id}`)
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      console.log(`Invalid ObjectId: ${id}`)
      return { success: false, error: "Invalid content ID" }
    }

    const result = await db.collection("contents").deleteOne({ _id: new ObjectId(id) })

    console.log(`Delete result:`, result)

    if (result.deletedCount === 0) {
      console.log(`No content found with id: ${id}`)
      return { success: false, error: "Content not found or already deleted" }
    }

    console.log(`Successfully deleted content with id: ${id}`)
    return { success: true, message: "Content deleted successfully" }
  } catch (error) {
    console.error("content deleted please reload")
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

export async function getAllHashtags() {
  try {
    const { db } = await connectToDatabase()
    const contents = await db.collection("contents").find({}, { hashtags: 1 }).toArray()
    const allHashtags = contents.flatMap((content) => {
      if (Array.isArray(content.hashtags)) {
        return content.hashtags.map((tag) => tag.trim())
      } else if (typeof content.hashtags === "string") {
        return content.hashtags.split(",").map((tag) => tag.trim())
      }
      return []
    })
    const uniqueHashtags = [...new Set(allHashtags)]
    return { success: true, hashtags: uniqueHashtags }
  } catch (error) {
    console.error("Error fetching hashtags:", error)
    return { success: false, error: error.message }
  }
}

export async function getAllFiles() {
  try {
    const { db } = await connectToDatabase()
    const contents = await db.collection("contents").find({}).toArray()
    return {
      success: true,
      contents: contents.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
      })),
    }
  } catch (error) {
    console.error("Error fetching contents:", error)
    return { success: false, error: error.message }
  }
}

export async function getAllCategories() {
  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection("contents").distinct("category")
    return { success: true, categories }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: error.message }
  }
}

export async function syncUsersFromClerk() {
  try {
    const { db } = await connectToDatabase()
    const clerkUsers = await clerkClient.users.getUserList({
      limit: 100,
    })

    const bulkOps = clerkUsers.map((user) => ({
      updateOne: {
        filter: { clerkId: user.id },
        update: {
          $set: {
            clerkId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0]?.emailAddress,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
        upsert: true,
      },
    }))

    const result = await db.collection("users").bulkWrite(bulkOps)

    return {
      success: true,
      message: `Synced ${result.upsertedCount} new users and updated ${result.modifiedCount} existing users.`,
    }
  } catch (error) {
    console.error("Error syncing users from Clerk:", error)
    return { success: false, error: error.message }
  }
}

