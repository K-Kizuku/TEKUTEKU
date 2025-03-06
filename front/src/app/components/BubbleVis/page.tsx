"use client"

import { useState } from "react"
import Bubble from "./../Bubble/page"
import type { BubbleType } from "./../../data/types"
import styles from "./BubbleVis.module.css"

interface BubbleVisProps {
  bubbles: BubbleType[]
  onLike: (id: number) => void
}

export default function BubbleVis({ bubbles, onLike }: BubbleVisProps) {
  const [selectedBubble, setSelectedBubble] = useState<number | null>(null)
  const [bubblesData, setBubblesData] = useState<BubbleType[]>(bubbles)
  
  // バブルのリプライ表示を切り替える
  const toggleReplies = (id: number) => {
    setSelectedBubble(selectedBubble === id ? null : id)
  }

  // 新しいリプライを追加する
  const handleAddReply = (bubbleId: number, replyText: string) => {
    setBubblesData(prevBubbles => {
      return prevBubbles.map(bubble => {
        if (bubble.id === bubbleId) {
          // Create a new reply object
          const newReply = {
            id: Date.now(), // Generate a unique ID using timestamp
            text: replyText,
            likes: 0
          };
          
          // Add the new reply to the existing replies or create a new array if no replies exist
          const updatedReplies = bubble.replies ? [...bubble.replies, newReply] : [newReply];
          
          // Return the updated bubble
          return {
            ...bubble,
            replies: updatedReplies
          };
        }
        return bubble;
      });
    });
  };

  // バブルにいいねを追加する機能を拡張
  const handleLike = (id: number) => {
    onLike(id);
    // ローカルステートも更新
    setBubblesData(prevBubbles => 
      prevBubbles.map(bubble => 
        bubble.id === id ? { ...bubble, likes: bubble.likes + 1 } : bubble
      )
    );
  }
  
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        {bubblesData.map((bubble) => (
          <Bubble
            key={bubble.id}
            bubble={bubble}
            onLike={handleLike}
            showReplies={selectedBubble === bubble.id}
            toggleReplies={() => toggleReplies(bubble.id)}
            position={{ x: bubble.x, y: bubble.y }}
            onAddReply={handleAddReply}
          />
        ))}
      </div>
    </div>
  )
}