"use client"

import { useState, useEffect } from "react"
import Bubble from "./../Bubble/page"
import type { BubbleType } from "./../../data/types"
import styles from "./bubblevis.module.css"

interface BubbleVisProps {
  bubbles: BubbleType[]
  onLike: (id: number) => void
}

export default function BubbleVis({ bubbles, onLike }: BubbleVisProps) {
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [selectedBubble, setSelectedBubble] = useState<number | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })

  // Helper function to calculate bubble size based on likes
  const getBubbleSize = (likes: number) => 50 + likes * 5

  // Helper function to check if two bubbles overlap
  const checkOverlap = (
    pos1: { x: number; y: number },
    size1: number,
    pos2: { x: number; y: number },
    size2: number,
  ) => {
    // Calculate distance between centers
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // If distance is less than sum of radii, they overlap
    return distance < size1 / 2 + size2 / 2 + 10 // Adding 10px buffer
  }

  // Generate a non-overlapping position for a bubble
  const generateNonOverlappingPosition = (
    bubbleId: number,
    bubbleLikes: number,
    existingPositions: { [key: number]: { x: number; y: number } },
  ) => {
    const bubbleSize = getBubbleSize(bubbleLikes)
    const padding = bubbleSize / 2 + 10 // Add padding to avoid edges

    let attempts = 0
    const maxAttempts = 100 // Prevent infinite loops

    while (attempts < maxAttempts) {
      // Generate a random position
      const newPos = {
        x: padding + Math.random() * (containerSize.width - 2 * padding),
        y: padding + Math.random() * (containerSize.height - 2 * padding),
      }

      // Check if this position overlaps with any existing bubble
      let hasOverlap = false

      for (const id in existingPositions) {
        if (Number.parseInt(id) !== bubbleId) {
          // Don't check against itself
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

      // If no overlap, return this position
      if (!hasOverlap) {
        return newPos
      }

      attempts++
    }

    // If we couldn't find a non-overlapping position after max attempts,
    // return a position with some offset from the center
    return {
      x: containerSize.width / 2 + (Math.random() - 0.5) * 100,
      y: containerSize.height / 2 + (Math.random() - 0.5) * 100,
    }
  }

  // Initialize non-overlapping positions for bubbles
  useEffect(() => {
    setPositions((prevPositions) => {
      const newPositions = { ...prevPositions }

      // Process bubbles in order of size (largest first)
      // This helps place larger bubbles first, which are harder to position
      const sortedBubbles = [...bubbles].sort((a, b) => b.likes - a.likes)

      for (const bubble of sortedBubbles) {
        if (!newPositions[bubble.id]) {
          newPositions[bubble.id] = generateNonOverlappingPosition(bubble.id, bubble.likes, newPositions)
        }
      }

      return newPositions
    })
  }, [bubbles])

  // Update positions when likes change (bubble sizes change)
  useEffect(() => {
    setPositions((prevPositions): Record<number, { x: number; y: number }> => {
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

  // Update container size on window resize
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

  const toggleReplies = (id: number) => {
    setSelectedBubble(selectedBubble === id ? null : id)
  }

  return (
    <div className={styles.container} style={{ width: containerSize.width, height: containerSize.height }}>
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          bubble={bubble}
          onLike={onLike}
          position={positions[bubble.id] || { x: containerSize.width / 2, y: containerSize.height / 2 }}
          showReplies={selectedBubble === bubble.id}
          toggleReplies={() => toggleReplies(bubble.id)}
        />
      ))}
    </div>
  )
}

