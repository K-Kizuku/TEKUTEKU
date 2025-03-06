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
  
  // バブルのリプライ表示を切り替える
  const toggleReplies = (id: number) => {
    setSelectedBubble(selectedBubble === id ? null : id)
  }

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            bubble={bubble}
            onLike={onLike}
            showReplies={selectedBubble === bubble.id}
            toggleReplies={() => toggleReplies(bubble.id)}
            position={{ x: bubble.x, y: bubble.y }}
          />
        ))}
      </div>
    </div>
  )
}