'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBoardStore } from '@/lib/store/board-store'
import CardModal from './CardModal'
import { Calendar, CheckSquare, MessageSquare, Paperclip, User } from 'lucide-react'
import { format } from 'date-fns'

interface CardProps {
  card: any
}

export default function Card({ card }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getDueDateColor = () => {
    if (!card.due_date) return ''
    if (card.due_complete) return 'bg-green-100 text-green-700'
    
    const now = new Date()
    const dueDate = new Date(card.due_date)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'bg-red-100 text-red-700'
    if (diffDays <= 1) return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        {card.cover_color && (
          <div
            className="h-8 -m-3 mb-2 rounded-t-lg"
            style={{ backgroundColor: card.cover_color }}
          />
        )}

        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels.map((label: any) => (
              <span
                key={label.id}
                className="px-2 py-0.5 text-xs font-medium text-white rounded"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-800 mb-2">{card.title}</p>

        <div className="flex items-center gap-3 text-xs text-gray-600">
          {card.due_date && (
            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${getDueDateColor()}`}>
              <Calendar className="w-3 h-3" />
              {format(new Date(card.due_date), 'MMM d')}
            </span>
          )}
          
          {card.description && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
            </span>
          )}

          {card.checklist_count && card.checklist_count > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              {card.checklist_complete}/{card.checklist_count}
            </span>
          )}

          {card.attachment_count && card.attachment_count > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              {card.attachment_count}
            </span>
          )}

          {card.members && card.members.length > 0 && (
            <div className="flex -space-x-1 ml-auto">
              {card.members.slice(0, 3).map((member: any) => (
                <div
                  key={member.id}
                  className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                  title={member.full_name || member.email}
                >
                  {(member.full_name || member.email)[0].toUpperCase()}
                </div>
              ))}
              {card.members.length > 3 && (
                <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-700 text-xs font-semibold">
                  +{card.members.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <CardModal
          card={card}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}