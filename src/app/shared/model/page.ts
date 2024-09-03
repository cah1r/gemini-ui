export interface Page<T> {
  content: T[]
  page: PageData
}

interface PageData {
  size: number
  number: number
  totalElements: number
  totalPages: number
}
