import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-[#1c2333] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#e74c3c] rounded-full flex items-center justify-center">
            <span className="text-white font-bold">Lfg</span>
          </div>
          <span className="text-white text-xl font-semibold">Libraryofg (V1)</span>
        </Link>

        <div className="flex items-center gap-4 text-white">
          <span>Welcome, MEHEDI HASAN!</span>
          <Link href="/admin" className="text-[#e74c3c] hover:text-[#c0392b]">
            Admin Panel
          </Link>
        </div>
      </div>
    </header>
  )
}

