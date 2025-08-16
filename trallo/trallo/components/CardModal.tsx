'use client'

import { useState, useEffect } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import { X, Calendar, Tag, User, CheckSquare, Paperclip, MessageSquare, Clock, Archive, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface CardModalProps {
  card: any
  isOpen: boolean
  onClose: () => void
}

export default function CardModal({ card, isOpen, onClose }: CardModalProps) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || '')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const { updateCard, deleteCard, board } = useBoardStore()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!isOpen) return null

  const handleUpdateTitle = async () => {
    if (title.trim() && title !== card.title) {
      await updateCard(card.id, { title })
      card.title = title
    } else {
      setTitle(card.title)
    }
    setIsEditingTitle(false)
  }

  const handleUpdateDescription = async () => {
    if (description !== card.description) {
      await updateCard(card.id, { description })
      card.description = description
    }
    setIsEditingDescription(false)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this card?')) {
      await deleteCard(card.id)
      onClose()
    }
  }

  const list = board?.lists.find(l => l.cards.some(c => c.id === card.id))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mt-16 mb-8">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleUpdateTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdateTitle()
                    if (e.key === 'Escape') {
                      setTitle(card.title)
                      setIsEditingTitle(false)
                    }
                  }}
                  className="text-xl font-semibold w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded -ml-2"
                >
                  {card.title}
                </h2>
              )}
              <p className="text-sm text-gray-500 mt-1 px-2">
                in list <span className="font-medium">{list?.title}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {card.labels && card.labels.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.labels.map((label: any) => (
                      <span
                        key={label.id}
                        className="px-3 py-1 text-sm font-medium text-white rounded"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {card.due_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Due Date</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded text-sm ${
                      card.due_complete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {format(new Date(card.due_date), 'MMM d, yyyy')}
                    </span>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={card.due_complete}
                        onChange={(e) => {
                          updateCard(card.id, { due_complete: e.target.checked })
                          card.due_complete = e.target.checked
                        }}
                        className="rounded"
                      />
                      Complete
                    </label>
                  </div>
                </div>
              )}

              {card.members && card.members.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Members</h3>
                  <div className="flex gap-2">
                    {card.members.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
                      >
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {(member.full_name || member.email)[0].toUpperCase()}
                        </div>
                        <span className="text-sm">{member.full_name || member.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                {isEditingDescription ? (
                  <div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Add a more detailed description..."
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleUpdateDescription}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setDescription(card.description || '')
                          setIsEditingDescription(false)
                        }}
                        className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditingDescription(true)}
                    className="min-h-[60px] px-3 py-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  >
                    {description ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{description}</p>
                    ) : (
                      <p className="text-sm text-gray-400">Add a more detailed description...</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Activity</h3>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-500">No activity yet</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Add to card</h3>
              
              <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                Members
              </button>
              
              <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Labels
              </button>
              
              <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Checklist
              </button>
              
              <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </button>
              
              <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachment
              </button>

              <h3 className="text-sm font-medium text-gray-700 mb-3 mt-6">Actions</h3>
              
              <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                <Archive className="w-4 h-4" />
                Archive
              </button>
              
              <button
                onClick={handleDelete}
                className="w-full text-left px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}