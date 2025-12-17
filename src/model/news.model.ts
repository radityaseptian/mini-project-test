export enum NewsSource {
  Twitter = 'twitter',
  Facebook = 'facebook',
  Website = 'website',
}

export type NewsData = {
  id: number
  title: string
  content: string
  author: string
  source: NewsSource
  created_at: Date
}

export type CreateNewsInput = {
  title: string
  content: string
  author: string
  source: NewsSource
}

export type RequestPaginationQuery = {
  page?: number
  limit?: number
  source?: string
}
