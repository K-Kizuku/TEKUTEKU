"use client"

import { useState, useEffect } from "react"
import Bubble from "./../Bubble/page"
import type { BubbleType } from "./../../data/types"
import styles from "./BubbleVis.module.css"

interface BubbleVisProps {
  bubbles: BubbleType[]
  onLike: (id: number) => void
}

export default function BubbleVis({ bubbles, onLike }: BubbleVisProps) {
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [selectedBubble, setSelectedBubble] = useState<number | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })

  // Calculate bubble size based on likes
  const getBubbleSize = (likes: number) => 50 + likes * 5

  // Check if bubbles overlap
  const checkOverlap = (
    pos1: { x: number; y: number },
    size1: number,
    pos2: { x: number; y: number },
    size2: number,
  ) => {
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Add buffer to prevent too-close placement
    return distance < size1 / 2 + size2 / 2 + 20
  }

  // Generate a non-overlapping position for a bubble
  const generateNonOverlappingPosition = (
    bubbleId: number,
    bubbleLikes: number,
    existingPositions: { [key: number]: { x: number; y: number } },
  ) => {
    const bubbleSize = getBubbleSize(bubbleLikes)
    const padding = bubbleSize / 2 + 20 // Increased padding

    let attempts = 0
    const maxAttempts = 200 // Increased max attempts

    while (attempts < maxAttempts) {
      // Generate random position with more spread
      const newPos = {
        x: padding + Math.random() * (containerSize.width - 2 * padding),
        y: padding + Math.random() * (containerSize.height - 2 * padding),
      }

      // Check for overlap with existing bubbles
      let hasOverlap = false

      for (const id in existingPositions) {
        if (Number.parseInt(id) !== bubbleId) {
          const otherBubble = bubbles.find((b) => b.id === Number.parseInt(id))
          if (otherBubble) {
            const otherSize = getBubbleSize(otherBubble.likes)
            if (checkOverlap(newPos, bubbleSize, existingPositions[Number.parseInt(id)], otherSize)) {
              hasOverlap = true
              break
            }
          }
        }
      }

      // Return position if no overlap
      if (!hasOverlap) {
        return newPos
      }

      attempts++
    }

    // Fallback to slightly randomized center if no position found
    return {
      x: containerSize.width / 2 + (Math.random() - 0.5) * 200,
      y: containerSize.height / 2 + (Math.random() - 0.5) * 200,
    }
  }

  // Initialize bubble positions
  useEffect(() => {
    setPositions((prevPositions) => {
      const newPositions = { ...prevPositions }

      // Sort bubbles by likes to place larger bubbles first
      const sortedBubbles = [...bubbles].sort((a, b) => b.likes - a.likes)

      for (const bubble of sortedBubbles) {
        if (!newPositions[bubble.id]) {
          newPositions[bubble.id] = generateNonOverlappingPosition(bubble.id, bubble.likes, newPositions)
        }
      }

      return newPositions
    })
  }, [bubbles, containerSize])

  // Update positions when likes change or bubbles are modified
  useEffect(() => {
    setPositions((prevPositions) => {
      const newPositions = { ...prevPositions }

      const sortedBubbles = [...bubbles].sort((a, b) => b.likes - a.likes)

      for (const bubble of sortedBubbles) {
        if (!newPositions[bubble.id]) {
          newPositions[bubble.id] = generateNonOverlappingPosition(bubble.id, bubble.likes, newPositions)
        }
      }

      return newPositions
    })
  }, [bubbles])

  // Adjust container size on window resize
  useEffect(() => {
    const handleResize = () => {
      setContainerSize({
        width: window.innerWidth > 800 ? 800 : window.innerWidth - 40,
        height: window.innerHeight > 600 ? 600 : window.innerHeight - 100,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Toggle replies for a specific bubble
  const toggleReplies = (id: number) => {
    setSelectedBubble(selectedBubble === id ? null : id)
  }

  // Convert positions to array of positions for existingPositions prop
  const existingPositionsArray = Object.values(positions);

  return (
    <div className={styles.container} style={{ width: containerSize.width, height: containerSize.height }}>
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          bubble={bubble}
          onLike={onLike}
          existingPositions={existingPositionsArray}
          showReplies={selectedBubble === bubble.id}
          toggleReplies={() => toggleReplies(bubble.id)}
          position={positions[bubble.id] || { x: containerSize.width / 2, y: containerSize.height / 2 }}
        />
      ))}
    </div>
  )
}