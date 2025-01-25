import { NextResponse } from "next/server"
import { syncUsersFromClerk } from "../../../../actions/uploadActions"
// import { syncUsersFromClerk } from "@/actions/uploadActions"

export async function POST() {
  try {
    const result = await syncUsersFromClerk()
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in sync-users API route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

