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

export type BubbleType2 = {
  id: string;                // メッセージのユニークID
  text: string;              // バブルの中のテキスト
  likes: number;             // いいね数
  position: { x: number; y: number };  // 位置情報
  floatTime: number;         // 浮遊する時間 (秒)
  createdAt: string;         // 作成日時 (ISO 8601 形式)
  type: number;              // school の値 (バブルの種類を決める)
  replies: BubbleType[];     // リプライのリスト (ネスト構造)
};


