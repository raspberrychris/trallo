'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'

interface Board {
  id: string
  title: string
  description: string | null
  background_color: string | null
  background_image: string | null
  starred: boolean
}

interface BoardListProps {
  boards: Board[]
}

export default function BoardList({ boards }: BoardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {boards.map((board) => (
        <Link
          key={board.id}
          href={`/board/${board.id}`}
          className="relative group"
        >
          <div
            className="h-24 rounded-lg p-3 text-white font-medium shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between"
            style={{
              backgroundColor: board.background_color || '#0079bf',
              backgroundImage: board.background_image ? `url(${board.background_image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h3 className="text-lg font-semibold">{board.title}</h3>
            {board.starred && (
              <Star className="absolute top-2 right-2 w-4 h-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}