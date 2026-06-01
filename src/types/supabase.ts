import type { MenfessRecord } from './menfess'

export type Database = {
  public: {
    Tables: {
      menfess: {
        Row: MenfessRecord
        Insert: {
          id?: string
          message: string
          from?: string | null
          to?: string | null
          created_at?: string
          laugh?: number
          love?: number
          sad?: number
          angry?: number
        }
        Update: {
          id?: string
          message?: string
          from?: string | null
          to?: string | null
          created_at?: string
          laugh?: number
          love?: number
          sad?: number
          angry?: number
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}