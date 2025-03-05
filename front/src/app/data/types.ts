export interface ReplyType {
  id: number
  text: string
  likes: number
}

export interface BubbleType {
  id: number
  text: string
  likes: number
  replies?: ReplyType[]
}