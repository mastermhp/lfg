import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs"
import { connectToDatabase } from "../../../../lib/mongodb"
// import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""

    const client = await connectToDatabase()
    const db = client.db()

    // Fetch users from Clerk
    const clerkUsers = await clerkClient.users.getUserList({
      limit: 100, // Adjust this value based on your needs
      offset: 0,
    })

    // Save or update users in the database
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

    await db.collection("users").bulkWrite(bulkOps)

    // Fetch users from the database with pagination and search
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {}

    const totalUsers = await db.collection("users").countDocuments(query)
    const users = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

