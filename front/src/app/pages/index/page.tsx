"use client"

import { useState, useEffect } from "react"
import BubbleVis from "../../components/BubbleVis/page"
import styles from "./index.module.css"
import { BubbleType } from "@/app/data/types"

export default function Home() {
    const [data, setData] = useState<BubbleType[]>([])  // ← 型を BubbleType に統一


  const fetchData = async () => {
    try {
      const response = await fetch('/api/bubbles')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const bubbleData: BubbleType[] = await response.json()  // ← ここで型を指定
      setData(bubbleData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, 1000)
    return () => clearInterval(intervalId)
  }, [])

  const handleLike = (id: number) => {
    setData((prevData) =>
      prevData.map((bubble) =>
        bubble.id === id ? { ...bubble, likes: (bubble.likes ?? 0) + 1 } : bubble
      )
    )
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>デモ</h1>
        <BubbleVis bubbles={data} onLike={handleLike} />
      </main>
    </div>
  )
}
