'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import Link from 'next/link'
import { Star, Users, Lock, Globe, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface BoardHeaderProps {
  board: any
}

export default function BoardHeader({ board }: BoardHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(board.title)
  const supabase = createClient()

  const handleUpdateTitle = async () => {
    if (title.trim() && title !== board.title) {
      try {
        const { error } = await supabase
          .from('boards')
          .update({ title })
          .eq('id', board.id)

        if (error) throw error
        board.title = title
        toast.success('Board title updated')
      } catch (error) {
        toast.error('Failed to update title')
        setTitle(board.title)
      }
    }
    setIsEditingTitle(false)
  }

  const toggleStar = async () => {
    try {
      const { error } = await supabase
        .from('boards')
        .update({ starred: !board.starred })
        .eq('id', board.id)

      if (error) throw error
      board.starred = !board.starred
      toast.success(board.starred ? 'Board starred' : 'Board unstarred')
    } catch (error) {
      toast.error('Failed to update star status')
    }
  }

  const getVisibilityIcon = () => {
    switch (board.visibility) {
      case 'private':
        return <Lock className="w-4 h-4" />
      case 'workspace':
        return <Users className="w-4 h-4" />
      case 'public':
        return <Globe className="w-4 h-4" />
      default:
        return <Lock className="w-4 h-4" />
    }
  }

  return (
    <header className="bg-black bg-opacity-20 backdrop-blur-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/boards"
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateTitle()
                if (e.key === 'Escape') {
                  setTitle(board.title)
                  setIsEditingTitle(false)
                }
              }}
              className="text-lg font-bold bg-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-white"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-lg font-bold text-white hover:bg-white hover:bg-opacity-20 px-2 py-1 rounded transition-colors"
            >
              {board.title}
            </button>
          )}

          <button
            onClick={toggleStar}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors"
          >
            <Star className={`w-4 h-4 ${board.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </button>

          <div className="flex items-center gap-1 text-white bg-white bg-opacity-20 px-2 py-1 rounded">
            {getVisibilityIcon()}
            <span className="text-sm capitalize">{board.visibility}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-1.5 rounded transition-colors text-sm">
            Share
          </button>
          <button className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-1.5 rounded transition-colors text-sm">
            Menu
          </button>
        </div>
      </div>
    </header>
  )
}