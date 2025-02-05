// import { NextResponse } from "next/server"
// import { syncUsersFromClerk } from "../../../../actions/uploadActions"
// import { syncUsersFromClerk } from "@/actions/uploadActions"

// export async function POST() {
//   try {
//     const result = await syncUsersFromClerk()
//     if (result.success) {
//       return NextResponse.json(result)
//     } else {
//       return NextResponse.json({ error: result.error }, { status: 500 })
//     }
//   } catch (error) {
//     console.error("Error in sync-users API route:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

import { clerkClient } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { connectToDatabase } from "../../../../lib/mongodb"
// import { connectToDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const db = await connectToDatabase()
    const usersCollection = db.collection("users")

    const clerkUsers = await clerkClient.users.getUserList()

    const operations = clerkUsers.map((user) => ({
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
          },
        },
        upsert: true,
      },
    }))

    await usersCollection.bulkWrite(operations)

    return NextResponse.json({ success: true, message: "Users synced successfully" })
  } catch (error) {
    console.error("Error syncing users:", error)
    return NextResponse.json({ success: false, error: "Failed to sync users" }, { status: 500 })
  }
}


