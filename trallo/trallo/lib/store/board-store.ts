import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface Card {
  id: string
  list_id: string
  title: string
  description: string | null
  position: number
  due_date: string | null
  due_complete: boolean
  cover_color: string | null
  labels?: Label[]
  members?: Member[]
  checklist_count?: number
  checklist_complete?: number
  attachment_count?: number
  comment_count?: number
}

interface List {
  id: string
  board_id: string
  title: string
  position: number
  cards: Card[]
}

interface Label {
  id: string
  name: string
  color: string
}

interface Member {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

interface Board {
  id: string
  title: string
  description: string | null
  background_color: string | null
  background_image: string | null
  starred: boolean
  lists: List[]
  labels: Label[]
  members: Member[]
}

interface BoardStore {
  board: Board | null
  loading: boolean
  error: string | null
  
  loadBoard: (boardId: string) => Promise<void>
  createList: (boardId: string, title: string) => Promise<void>
  updateList: (listId: string, title: string) => Promise<void>
  deleteList: (listId: string) => Promise<void>
  moveList: (listId: string, newPosition: number) => Promise<void>
  
  createCard: (listId: string, title: string) => Promise<void>
  updateCard: (cardId: string, updates: Partial<Card>) => Promise<void>
  deleteCard: (cardId: string) => Promise<void>
  moveCard: (cardId: string, targetListId: string, position: number) => Promise<void>
  
  createLabel: (boardId: string, name: string, color: string) => Promise<void>
  toggleCardLabel: (cardId: string, labelId: string) => Promise<void>
  
  assignMember: (cardId: string, userId: string) => Promise<void>
  unassignMember: (cardId: string, userId: string) => Promise<void>
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  board: null,
  loading: false,
  error: null,

  loadBoard: async (boardId: string) => {
    set({ loading: true, error: null })
    const supabase = createClient()

    try {
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .select(`
          *,
          lists (
            *,
            cards (
              *,
              card_labels (
                label:labels (*)
              ),
              card_members (
                member:users (*)
              )
            )
          ),
          labels (*),
          workspace:workspaces (
            workspace_members (
              member:users (*)
            )
          )
        `)
        .eq('id', boardId)
        .single()

      if (boardError) throw boardError

      const formattedBoard = {
        ...board,
        lists: board.lists
          .sort((a: any, b: any) => a.position - b.position)
          .map((list: any) => ({
            ...list,
            cards: list.cards
              .sort((a: any, b: any) => a.position - b.position)
              .map((card: any) => ({
                ...card,
                labels: card.card_labels?.map((cl: any) => cl.label) || [],
                members: card.card_members?.map((cm: any) => cm.member) || [],
              })),
          })),
        members: board.workspace?.workspace_members?.map((wm: any) => wm.member) || [],
      }

      set({ board: formattedBoard, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createList: async (boardId: string, title: string) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    const maxPosition = Math.max(...board.lists.map(l => l.position), -1)

    try {
      const { data, error } = await supabase
        .from('lists')
        .insert({
          board_id: boardId,
          title,
          position: maxPosition + 1,
        })
        .select()
        .single()

      if (error) throw error

      set({
        board: {
          ...board,
          lists: [...board.lists, { ...data, cards: [] }],
        },
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateList: async (listId: string, title: string) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    try {
      const { error } = await supabase
        .from('lists')
        .update({ title })
        .eq('id', listId)

      if (error) throw error

      set({
        board: {
          ...board,
          lists: board.lists.map(list =>
            list.id === listId ? { ...list, title } : list
          ),
        },
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  deleteList: async (listId: string) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    try {
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', listId)

      if (error) throw error

      set({
        board: {
          ...board,
          lists: board.lists.filter(list => list.id !== listId),
        },
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  moveList: async (listId: string, newPosition: number) => {
    const board = get().board
    if (!board) return

    const lists = [...board.lists]
    const listIndex = lists.findIndex(l => l.id === listId)
    const [movedList] = lists.splice(listIndex, 1)
    lists.splice(newPosition, 0, movedList)

    const updatedLists = lists.map((list, index) => ({
      ...list,
      position: index,
    }))

    set({
      board: {
        ...board,
        lists: updatedLists,
      },
    })

    const supabase = createClient()
    for (const list of updatedLists) {
      await supabase
        .from('lists')
        .update({ position: list.position })
        .eq('id', list.id)
    }
  },

  createCard: async (listId: string, title: string) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    const list = board.lists.find(l => l.id === listId)
    if (!list) return

    const maxPosition = Math.max(...list.cards.map(c => c.position), -1)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('cards')
        .insert({
          list_id: listId,
          title,
          position: maxPosition + 1,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      set({
        board: {
          ...board,
          lists: board.lists.map(l =>
            l.id === listId
              ? { ...l, cards: [...l.cards, { ...data, labels: [], members: [] }] }
              : l
          ),
        },
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateCard: async (cardId: string, updates: Partial<Card>) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    try {
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId)

      if (error) throw error

      set({
        board: {
          ...board,
          lists: board.lists.map(list => ({
            ...list,
            cards: list.cards.map(card =>
              card.id === cardId ? { ...card, ...updates } : card
            ),
          })),
        },
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  deleteCard: async (cardId: string) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId)

      if (error) throw error

      set({
        board: {
          ...board,
          lists: board.lists.map(list => ({
            ...list,
            cards: list.cards.filter(card => card.id !== cardId),
          })),
        },
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  moveCard: async (cardId: string, targetListId: string, position: number) => {
    const board = get().board
    if (!board) return

    let movedCard: Card | undefined
    const updatedLists = board.lists.map(list => {
      const cards = [...list.cards]
      const cardIndex = cards.findIndex(c => c.id === cardId)
      
      if (cardIndex !== -1) {
        [movedCard] = cards.splice(cardIndex, 1)
      }
      
      if (list.id === targetListId && movedCard) {
        cards.splice(position, 0, { ...movedCard, list_id: targetListId })
      }
      
      return {
        ...list,
        cards: cards.map((card, index) => ({ ...card, position: index })),
      }
    })

    set({
      board: {
        ...board,
        lists: updatedLists,
      },
    })

    const supabase = createClient()
    await supabase
      .from('cards')
      .update({ list_id: targetListId, position })
      .eq('id', cardId)

    const targetList = updatedLists.find(l => l.id === targetListId)
    if (targetList) {
      for (const card of targetList.cards) {
        await supabase
          .from('cards')
          .update({ position: card.position })
          .eq('id', card.id)
      }
    }
  },

  createLabel: async (boardId: string, name: string, color: string) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    try {
      const { data, error } = await supabase
        .from('labels')
        .insert({
          board_id: boardId,
          name,
          color,
        })
        .select()
        .single()

      if (error) throw error

      set({
        board: {
          ...board,
          labels: [...board.labels, data],
        },
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  toggleCardLabel: async (cardId: string, labelId: string) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    const list = board.lists.find(l => l.cards.some(c => c.id === cardId))
    const card = list?.cards.find(c => c.id === cardId)

    if (!card) return

    const hasLabel = card.labels?.some(l => l.id === labelId)

    try {
      if (hasLabel) {
        const { error } = await supabase
          .from('card_labels')
          .delete()
          .eq('card_id', cardId)
          .eq('label_id', labelId)

        if (error) throw error

        set({
          board: {
            ...board,
            lists: board.lists.map(l => ({
              ...l,
              cards: l.cards.map(c =>
                c.id === cardId
                  ? { ...c, labels: c.labels?.filter(label => label.id !== labelId) }
                  : c
              ),
            })),
          },
        })
      } else {
        const { error } = await supabase
          .from('card_labels')
          .insert({
            card_id: cardId,
            label_id: labelId,
          })

        if (error) throw error

        const label = board.labels.find(l => l.id === labelId)
        if (label) {
          set({
            board: {
              ...board,
              lists: board.lists.map(l => ({
                ...l,
                cards: l.cards.map(c =>
                  c.id === cardId
                    ? { ...c, labels: [...(c.labels || []), label] }
                    : c
                ),
              })),
            },
          })
        }
      }
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  assignMember: async (cardId: string, userId: string) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    try {
      const { error } = await supabase
        .from('card_members')
        .insert({
          card_id: cardId,
          user_id: userId,
        })

      if (error) throw error

      const member = board.members.find(m => m.id === userId)
      if (member) {
        set({
          board: {
            ...board,
            lists: board.lists.map(l => ({
              ...l,
              cards: l.cards.map(c =>
                c.id === cardId
                  ? { ...c, members: [...(c.members || []), member] }
                  : c
              ),
            })),
          },
        })
      }
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  unassignMember: async (cardId: string, userId: string) => {
    const supabase = createClient()
    const board = get().board

    if (!board) return

    try {
      const { error } = await supabase
        .from('card_members')
        .delete()
        .eq('card_id', cardId)
        .eq('user_id', userId)

      if (error) throw error

      set({
        board: {
          ...board,
          lists: board.lists.map(l => ({
            ...l,
            cards: l.cards.map(c =>
              c.id === cardId
                ? { ...c, members: c.members?.filter(m => m.id !== userId) }
                : c
            ),
          })),
        },
      })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))