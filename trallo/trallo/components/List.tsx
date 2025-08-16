'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useBoardStore } from '@/lib/store/board-store'
import Card from './Card'
import AddCard from './AddCard'
import { MoreHorizontal, X } from 'lucide-react'

interface ListProps {
  list: any
}

export default function List({ list }: ListProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(list.title)
  const [showMenu, setShowMenu] = useState(false)
  const { updateList, deleteList } = useBoardStore()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleUpdateTitle = async () => {
    if (title.trim() && title !== list.title) {
      await updateList(list.id, title)
    } else {
      setTitle(list.title)
    }
    setIsEditingTitle(false)
  }

  const handleDeleteList = async () => {
    if (confirm('Are you sure you want to delete this list? All cards will be lost.')) {
      await deleteList(list.id)
    }
    setShowMenu(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0"
    >
      <div className="flex items-center justify-between mb-3" {...attributes} {...listeners}>
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdateTitle()
              if (e.key === 'Escape') {
                setTitle(list.title)
                setIsEditingTitle(false)
              }
            }}
            className="flex-1 px-2 py-1 text-sm font-semibold bg-white rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <h3
            onClick={() => setIsEditingTitle(true)}
            className="flex-1 font-semibold text-gray-800 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded"
          >
            {list.title}
          </h3>
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-20">
                <div className="flex items-center justify-between p-2 border-b">
                  <span className="text-sm font-medium">List Actions</span>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsEditingTitle(true)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    Rename List
                  </button>
                  <button
                    onClick={handleDeleteList}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    Delete List
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <SortableContext
        items={list.cards.map((c: any) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 min-h-[20px]">
          {list.cards.map((card: any) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>

      <AddCard listId={list.id} />
    </div>
  )
}