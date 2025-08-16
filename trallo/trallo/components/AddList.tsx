'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import { Plus, X } from 'lucide-react'

interface AddListProps {
  boardId: string
}

export default function AddList({ boardId }: AddListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const { createList } = useBoardStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    await createList(boardId, title)
    setTitle('')
    setIsAdding(false)
  }

  const handleCancel = () => {
    setTitle('')
    setIsAdding(false)
  }

  if (isAdding) {
    return (
      <div className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list title..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add list
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 w-72 flex-shrink-0 text-white font-medium flex items-center gap-2 transition-colors"
    >
      <Plus className="w-4 h-4" />
      Add another list
    </button>
  )
}