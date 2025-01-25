// import React from "react"

// export default function Sidebar({ contents, categories, hashtags, onContentSelect, activeTab, onTabChange }) {
//   return (
//     <aside className="w-64 bg-gray-800 text-white p-6 overflow-auto">
//       <nav className="mb-6">
//         <button
//           className={`mr-4 ${activeTab === "contents" ? "text-blue-400" : ""}`}
//           onClick={() => onTabChange("contents")}
//         >
//           Contents
//         </button>
//         <button
//           className={`mr-4 ${activeTab === "categories" ? "text-blue-400" : ""}`}
//           onClick={() => onTabChange("categories")}
//         >
//           Categories
//         </button>
//         <button
//           className={`${activeTab === "hashtags" ? "text-blue-400" : ""}`}
//           onClick={() => onTabChange("hashtags")}
//         >
//           Hashtags
//         </button>
//       </nav>

//       {activeTab === "contents" && (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Contents</h2>
//           <ul>
//             {contents.map((content) => (
//               <li
//                 key={content._id}
//                 className="mb-2 cursor-pointer hover:text-gray-300"
//                 onClick={() => onContentSelect(content)}
//               >
//                 {content.title}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {activeTab === "categories" && (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Categories</h2>
//           <ul>
//             {categories.map((category) => (
//               <li key={category} className="mb-2 cursor-pointer hover:text-gray-300">
//                 {category}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {activeTab === "hashtags" && (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Hashtags</h2>
//           <ul>
//             {hashtags.map((hashtag) => (
//               <li key={hashtag} className="mb-2 cursor-pointer hover:text-gray-300">
//                 #{hashtag}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </aside>
//   )
// }

import React from "react"
import Image from "next/image"

export default function Sidebar({ contents, categories, hashtags, onContentSelect, activeTab, onTabChange, navItems }) {
  return (
    <aside className="sidebar w-64 flex flex-col">
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2 h-8">
          {/* <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" /> */}
          <span className="font-semibold text-red-900">Admin Panel</span>
        </div>
      </div>
      <nav className="flex-1 p-4 mb-12">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.tab)}
            className={`w-full flex items-center gap-3 px-3 py-2 mb-4 rounded-md transition-colors
              ${activeTab === item.tab ? "bg-red-800 text-white" : "hover:bg-[hsl(var(--sidebar-bg))]"}`}
          >
            <item.icon className="w-5 h-5 text-white" />
            <span className="text-white">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

