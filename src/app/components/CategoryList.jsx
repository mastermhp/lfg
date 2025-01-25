import React from "react"

export default function CategoryList({ categories }) {
  return (
    <div className="flex flex-wrap gap-4">
      {categories.map((category) => (
        <div key={category} className="bg-slate-800 bg-opacity-35 border-red-700 text-red-700 px-6 py-2 rounded-xl shadow-xl">
          <h3 className="text-xl">{category}</h3>
          {/* Add more category details here if needed */}
        </div>
      ))}
    </div>
  )
}

