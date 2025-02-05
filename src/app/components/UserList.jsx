"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

export default function UserList() {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = useCallback(async (page, searchQuery) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/users?page=${page}&limit=10&search=${searchQuery}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.currentPage || 1)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.message)
      setUsers([])
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchUsers(currentPage, search)
  }, [currentPage, search, fetchUsers])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers(1, search)
  }

  const handleRetry = () => {
    fetchUsers(currentPage, search)
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
      </div>

      {isLoading ? (
        <div className="text-center text-white">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 flex flex-col items-center">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
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
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={user.imageUrl || "/placeholder.svg"} alt="" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{`${user.firstName} ${user.lastName}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{user.emailAddresses[0]?.emailAddress}</div>
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
          disabled={currentPage === 1 || isLoading}
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
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
          <span className="sr-only">Next Page</span>
        </button>
      </div>
    </div>
  )
}

