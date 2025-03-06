'use client';

// BubbleVis コンポーネント内の修正
import { useState } from "react";
import Bubble from "./../Bubble/page";
import type { BubbleType2 } from "./../../data/types";
import styles from "./BubbleVis.module.css";

interface BubbleVisProps {
  bubbles: BubbleType2[];
  onLike: (id: string) => void;
}

export default function BubbleVis({ bubbles, onLike }: BubbleVisProps) {
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [bubblesData, setBubblesData] = useState<BubbleType2[]>(bubbles);
  
  // バブルのリプライ表示を切り替える
  const toggleReplies = (id: string) => {
    setSelectedBubble(selectedBubble === id ? null : id);
  };

  // 新しいリプライを追加する
  const handleAddReply = (bubbleId: string, replyText: string) => {
    setBubblesData((prevBubbles) => {
      return prevBubbles.map((bubble) => {
        if (bubble.id === bubbleId) {
          const newReply = {
            id: `${Date.now()}`, // 文字列のIDに変更
            text: replyText,
            likes: 0
          };
  
          // repliesがBubbleType2の型を満たすように、型を整える
          return {
            ...bubble,
            replies: bubble.replies ? [...bubble.replies, newReply] : [newReply]
          };
        }
        return bubble;
      });
    });
  };
  
  

  // バブルにいいねを追加する
  const handleLike = (id: string) => {
    onLike(id);
    setBubblesData(prevBubbles =>
      prevBubbles.map(bubble =>
        bubble.id === id ? { ...bubble, likes: bubble.likes + 1 } : bubble
      )
    );
  };

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
            onAddReply={handleAddReply}
          />
        ))}
      </div>
    </div>
  );
}
