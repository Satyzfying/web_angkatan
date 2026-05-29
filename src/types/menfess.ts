export interface MenfessRecord {
  id: string
  message: string
  from: string | null
  to: string | null
  created_at: string
}

export interface MenfessListData {
  items: MenfessRecord[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}

export interface ActionResult<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}