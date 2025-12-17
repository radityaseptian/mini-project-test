export type PaginatedResponse<T> = {
  page: number
  limit: number
  total: number
  data: T[]
}
