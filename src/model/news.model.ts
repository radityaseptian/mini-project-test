export type NewsData = {
  id: number
  title: string
  content: string
  author: string
  source: string
  created_at: Date
}

export type CreateNewsInput = {
  title: string
  content: string
  author: string
  source: string
}

export type RequestPaginationQuery = {
  page?: number
  limit?: number
  source?: string
}
