'use client'

import { useEffect } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import { DndContext, DragEndEvent, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable'
import BoardHeader from './BoardHeader'
import List from './List'
import AddList from './AddList'
import { useState } from 'react'
import Card from './Card'
import toast, { Toaster } from 'react-hot-toast'

interface BoardViewProps {
  boardId: string
  initialBoard: any
}

export default function BoardView({ boardId, initialBoard }: BoardViewProps) {
  const { board, loading, error, loadBoard, moveList, moveCard } = useBoardStore()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<'list' | 'card' | null>(null)

  useEffect(() => {
    loadBoard(boardId)
  }, [boardId, loadBoard])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDragStart = (event: any) => {
    const { active } = event
    setActiveId(active.id)
    setActiveType(active.data.current?.type || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      setActiveType(null)
      return
    }

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type === 'list') {
      if (active.id !== over.id && overData?.type === 'list') {
        const activeIndex = board?.lists.findIndex(l => l.id === active.id) ?? -1
        const overIndex = board?.lists.findIndex(l => l.id === over.id) ?? -1
        
        if (activeIndex !== -1 && overIndex !== -1) {
          moveList(active.id as string, overIndex)
        }
      }
    } else if (activeData?.type === 'card') {
      const cardId = active.id as string
      
      if (overData?.type === 'card') {
        const targetCard = board?.lists
          .flatMap(l => l.cards)
          .find(c => c.id === over.id)
        
        if (targetCard) {
          moveCard(cardId, targetCard.list_id, targetCard.position)
        }
      } else if (overData?.type === 'list') {
        const targetList = board?.lists.find(l => l.id === over.id)
        if (targetList) {
          moveCard(cardId, targetList.id, targetList.cards.length)
        }
      }
    }

    setActiveId(null)
    setActiveType(null)
  }

  if (loading && !board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading board...</div>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Board not found</div>
      </div>
    )
  }

  const activeItem = activeType === 'list' 
    ? board.lists.find(l => l.id === activeId)
    : activeType === 'card'
    ? board.lists.flatMap(l => l.cards).find(c => c.id === activeId)
    : null

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: board.background_color || '#0079bf',
        backgroundImage: board.background_image ? `url(${board.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Toaster position="top-right" />
      <BoardHeader board={board} />
      
      <div className="flex-1 overflow-x-auto">
        <div className="p-4">
          <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={board.lists.map(l => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-3 items-start">
                {board.lists.map((list) => (
                  <List key={list.id} list={list} />
                ))}
                <AddList boardId={boardId} />
              </div>
            </SortableContext>

            <DragOverlay>
              {activeType === 'list' && activeItem && (
                <div className="bg-gray-100 rounded-lg p-3 w-72 shadow-lg opacity-90">
                  <h3 className="font-semibold text-gray-800">
                    {(activeItem as any).title}
                  </h3>
                </div>
              )}
              {activeType === 'card' && activeItem && (
                <div className="bg-white rounded-lg p-3 shadow-lg opacity-90">
                  <p className="text-sm text-gray-800">
                    {(activeItem as any).title}
                  </p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}