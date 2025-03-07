'use client';

import { useState, useEffect } from "react";
import Bubble from "./../Bubble/page";
import type { BubbleType2, BubbleType } from "./../../data/types";
import styles from "./BubbleVis.module.css";

interface BubbleVisProps {
  bubbles: BubbleType2[];
  onLike: (id: string) => void;
}

export default function BubbleVis({ bubbles, onLike }: BubbleVisProps) {
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [bubblesData, setBubblesData] = useState<BubbleType2[]>(bubbles);
  const [newBubbleIds, setNewBubbleIds] = useState<Set<string>>(new Set());
  
  // When props.bubbles is updated, update internal state
  useEffect(() => {
    // Find new bubbles by comparing with existing data
    const existingIds = new Set(bubblesData.map(b => b.id));
    const newIds = new Set<string>();
    
    bubbles.forEach(bubble => {
      if (!existingIds.has(bubble.id)) {
        newIds.add(bubble.id);
      }
    });
    
    // Merge bubbles, keeping existing replies
    const mergedBubbles = bubbles.map(newBubble => {
      // Find existing bubble
      const existingBubble = bubblesData.find(b => b.id === newBubble.id);
      // Apply reply data from existing bubble if available
      if (existingBubble && existingBubble.replies && existingBubble.replies.length > 0) {
        return {
          ...newBubble,
          replies: existingBubble.replies
        };
      }
      return newBubble;
    });
    
    setBubblesData(mergedBubbles);
    setNewBubbleIds(newIds);
    
    // Clear new bubble IDs after animation duration
    const timer = setTimeout(() => {
      setNewBubbleIds(new Set());
    }, 1000); // Match this with your animation duration
    
    return () => clearTimeout(timer);
  }, [bubbles]);

  // Toggle bubble replies
  const toggleReplies = (id: string) => {
    setSelectedBubble(selectedBubble === id ? null : id);
  };

  // Add new reply - formatted as BubbleType
  const handleAddReply = (bubbleId: string, replyText: string) => {
    setBubblesData((prevBubbles) => {
      return prevBubbles.map((bubble) => {
        if (bubble.id === bubbleId) {
          // Create new reply matching BubbleType format
          const newReply: BubbleType = {
            id: Date.now(), // Numeric ID
            text: replyText,
            likes: 0,
            school: bubble.type, // Set school from type
            x: bubble.position.x,
            y: bubble.position.y,
            date: new Date(),
            replies: [] // Initialize nested replies as empty array
          };
          
          return {
            ...bubble,
            replies: [...bubble.replies, newReply]
          };
        }
        return bubble;
      });
    });
  };
  
  // Add like to bubble (notify parent component)
  const handleLike = (id: string) => {
    onLike(id); // Call parent component's onLike
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
            isNew={newBubbleIds.has(bubble.id)}
          />
        ))}
      </div>
    </div>
  );
}