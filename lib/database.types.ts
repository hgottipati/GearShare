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
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          is_approved: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          is_approved?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          is_approved?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          condition: string
          size: string | null
          price: number | null
          trade_only: boolean
          open_to_trade: boolean
          trade_wants: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category: string
          condition: string
          size?: string | null
          price?: number | null
          trade_only?: boolean
          open_to_trade?: boolean
          trade_wants?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string
          condition?: string
          size?: string | null
          price?: number | null
          trade_only?: boolean
          open_to_trade?: boolean
          trade_wants?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      listing_images: {
        Row: {
          id: string
          listing_id: string
          image_url: string
          image_order: number
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          image_url: string
          image_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          image_url?: string
          image_order?: number
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          listing_id: string
          sender_id: string
          receiver_id: string
          message: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          listing_id: string
          sender_id: string
          receiver_id: string
          message: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          listing_id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          created_at?: string
          read?: boolean
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          is_pinned: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          is_pinned?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          is_pinned?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      ski_lesson_submissions: {
        Row: {
          id: string
          email: string
          parent_name: string
          participant_name: string
          age: number
          phone_number: string
          ski_level: 'Beginner' | 'Intermediate' | 'Advanced'
          lesson_type: '4-week-private' | '4-week-group' | 'one-time-private' | 'one-time-group'
          preferred_day: 'Saturday' | 'Sunday' | 'Any'
          questions_preferences: string | null
          gear_status: 'ready' | 'need-help'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          parent_name: string
          participant_name: string
          age: number
          phone_number: string
          ski_level: 'Beginner' | 'Intermediate' | 'Advanced'
          lesson_type: '4-week-private' | '4-week-group' | 'one-time-private' | 'one-time-group'
          preferred_day: 'Saturday' | 'Sunday' | 'Any'
          questions_preferences?: string | null
          gear_status: 'ready' | 'need-help'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          parent_name?: string
          participant_name?: string
          age?: number
          phone_number?: string
          ski_level?: 'Beginner' | 'Intermediate' | 'Advanced'
          lesson_type?: '4-week-private' | '4-week-group' | 'one-time-private' | 'one-time-group'
          preferred_day?: 'Saturday' | 'Sunday' | 'Any'
          questions_preferences?: string | null
          gear_status?: 'ready' | 'need-help'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

