"use client"

import { useState } from "react"
import BubbleVis from "./../../components/BubbleVis/page"
import { bubbleData } from "./../../data/dummy"
import styles from "./index.module.css"

export default function Home() {
  const [data, setData] = useState(bubbleData)

  const handleLike = (id: number) => {
    setData((prevData) =>
      prevData.map((bubble) => (bubble.id === id ? { ...bubble, likes: bubble.likes + 1 } : bubble)),
    )
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Bubble Thoughts</h1>
        <BubbleVis bubbles={data} onLike={handleLike} />
      </main>
    </div>
  )
}
