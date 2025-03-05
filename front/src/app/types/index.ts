// types/index.ts
export interface BubbleData {
    id: number;
    content: string;
    likes: number;
    replies: number;
    timestamp: number; // UNIXタイムスタンプ（ミリ秒）
  }