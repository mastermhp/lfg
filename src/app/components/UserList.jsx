"use client"

import React, { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"

export default function UserList() {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const fetchUsers = async (page, searchQuery) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users?page=${page}&limit=10&search=${searchQuery}`)
      const data = await response.json()
      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.currentPage || 1)
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers(currentPage, search)
  }, [currentPage, search])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers(1, search)
  }

  const handleSyncUsers = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch("/api/sync-users", { method: "POST" })
      const data = await response.json()
      if (data.success) {
        alert(data.message)
        fetchUsers(currentPage, search)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error syncing users:", error)
      alert("Failed to sync users. Please try again.")
    }
    setIsSyncing(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="flex-1 px-4 py-2 rounded-md bg-[hsl(var(--content-bg))] border border-[hsl(var(--border))] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span className="sr-only">Search</span>
          </button>
        </form>
        <button
          onClick={handleSyncUsers}
          disabled={isSyncing}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Users"}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-white">Loading...</div>
      ) : (
        <div className="bg-[hsl(var(--content-bg))] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[hsl(var(--sidebar-bg))]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.clerkId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={user.imageUrl || "/placeholder.svg"} alt="" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{`${user.firstName} ${user.lastName}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-300">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Previous Page</span>
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
          <span className="sr-only">Next Page</span>
        </button>
      </div>
    </div>
  )
}

