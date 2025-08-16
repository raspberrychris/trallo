'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import { Plus, X } from 'lucide-react'

interface AddCardProps {
  listId: string
}

export default function AddCard({ listId }: AddCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const { createCard } = useBoardStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    await createCard(listId, title)
    setTitle('')
    setIsAdding(false)
  }

  const handleCancel = () => {
    setTitle('')
    setIsAdding(false)
  }

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="mt-2">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this card..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          autoFocus
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add card
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
    )
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full mt-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded flex items-center gap-2 transition-colors"
    >
      <Plus className="w-4 h-4" />
      Add a card
    </button>
  )
}