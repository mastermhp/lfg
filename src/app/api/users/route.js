import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { users } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""

    const { db } = await connectToDatabase()

    // Get users from database with pagination and search
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
    const dbUsers = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      users: dbUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

