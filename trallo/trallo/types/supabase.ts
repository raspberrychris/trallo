export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          created_at?: string
        }
      }
      boards: {
        Row: {
          id: string
          workspace_id: string
          title: string
          description: string | null
          background_color: string | null
          background_image: string | null
          visibility: 'private' | 'workspace' | 'public'
          starred: boolean
          archived: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          description?: string | null
          background_color?: string | null
          background_image?: string | null
          visibility?: 'private' | 'workspace' | 'public'
          starred?: boolean
          archived?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          description?: string | null
          background_color?: string | null
          background_image?: string | null
          visibility?: 'private' | 'workspace' | 'public'
          starred?: boolean
          archived?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          board_id: string
          title: string
          position: number
          archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          board_id: string
          title: string
          position: number
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          title?: string
          position?: number
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          list_id: string
          title: string
          description: string | null
          position: number
          due_date: string | null
          due_complete: boolean
          archived: boolean
          cover_color: string | null
          cover_image: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          list_id: string
          title: string
          description?: string | null
          position: number
          due_date?: string | null
          due_complete?: boolean
          archived?: boolean
          cover_color?: string | null
          cover_image?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          title?: string
          description?: string | null
          position?: number
          due_date?: string | null
          due_complete?: boolean
          archived?: boolean
          cover_color?: string | null
          cover_image?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      labels: {
        Row: {
          id: string
          board_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          board_id: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      card_labels: {
        Row: {
          id: string
          card_id: string
          label_id: string
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          label_id: string
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          label_id?: string
          created_at?: string
        }
      }
      card_members: {
        Row: {
          id: string
          card_id: string
          user_id: string
          assigned_at: string
        }
        Insert: {
          id?: string
          card_id: string
          user_id: string
          assigned_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          user_id?: string
          assigned_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          card_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          card_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          card_id: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number
          mime_type: string
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number
          mime_type: string
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          user_id?: string
          file_name?: string
          file_url?: string
          file_size?: number
          mime_type?: string
          created_at?: string
        }
      }
      checklists: {
        Row: {
          id: string
          card_id: string
          title: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          title: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          title?: string
          position?: number
          created_at?: string
        }
      }
      checklist_items: {
        Row: {
          id: string
          checklist_id: string
          content: string
          checked: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          checklist_id: string
          content: string
          checked?: boolean
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          checklist_id?: string
          content?: string
          checked?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          board_id: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          entity_title: string
          created_at: string
        }
        Insert: {
          id?: string
          board_id: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          entity_title: string
          created_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          entity_title?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}