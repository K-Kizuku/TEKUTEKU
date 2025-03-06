export interface ReplyType {
  id: number
  text: string
}

export interface BubbleType {
  school:number
  id: number
  text: string
  likes: number
  x:number
  y:number
  date:Date
  replies?: ReplyType[]
}