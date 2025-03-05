'use client';
import type { BubbleType } from "./../../data/types"
import styles from "./bubble.module.css"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react";
  
  interface BubbleProps {
    bubble: BubbleType;
    onLike: (id: number) => void;
    existingPositions: { x: number; y: number }[];
    showReplies: boolean;
    toggleReplies: () => void;
  }

  const generateRandomPosition = (existingPositions: { x: number; y: number }[] = [], size: number): { x: number, y: number } => {
    const maxAttempts = 100;
    let x: number | null = null, y: number | null = null, overlap: boolean;
  
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      // Generate random position within a 500px by 500px area
      x = Math.random() * 500;
      y = Math.random() * 500;
  
      overlap = existingPositions.some(
        (pos) => x !== null && y !== null && Math.abs(pos.x - x) < size + 10 && Math.abs(pos.y - y) < size + 10
      );
  
      if (!overlap) {
        return { x, y };
      }
    }
  
    // In case of too many collisions, return the last valid position found
    if (x !== null && y !== null) {
      return { x, y };
    }
  
    // If no valid position found, return default position (0, 0)
    return { x: 0, y: 0 };
  };
  
  
  export default function Bubble({
    bubble,
    onLike,
    existingPositions,
    showReplies,
    toggleReplies,
  }: BubbleProps) {
    const size = 50 + bubble.likes * 5; // Base size + additional size based on likes
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [animationDelay, setAnimationDelay] = useState<string | null>(null);
  
    useEffect(() => {
      // Calculate a non-overlapping position
      const { x, y } = generateRandomPosition(existingPositions, size);
      setPosition({ x, y });
  
      // Set animation delay for client-side rendering
      setAnimationDelay(`${Math.random() * 3}s`);
    }, [existingPositions, bubble.likes, size]);
  
    const bubbleStyle = {
      width: `${size}px`,
      height: `${size}px`,
      left: `${position.x}px`,
      top: `${position.y}px`,
      animationDelay: animationDelay || '0s', // animationDelay for client-side
    };
  
    const replies = bubble.replies || [];
  
    return (
      <div className={styles.bubbleContainer} style={bubbleStyle}>
        <div className={styles.bubble} onClick={toggleReplies}>
          <span className={styles.bubbleText}>{bubble.text}</span>
        </div>
  
        <button
          className={styles.likeButton}
          onClick={(e) => {
            e.stopPropagation();
            onLike(bubble.id);
          }}
        >
          <Heart size={16} className={styles.heartIcon} />
          <span className={styles.likeCount}>{bubble.likes}</span>
        </button>
  
        {showReplies && replies.length > 0 && (
          <div className={styles.repliesContainer}>
            {replies.map((reply, index) => {
              // Position replies in a circle around the main bubble
              const angle = (index * (360 / replies.length)) * (Math.PI / 180);
              const distance = size + 20;
              const replyX = Math.cos(angle) * distance;
              const replyY = Math.sin(angle) * distance;
  
              const replyStyle = {
                transform: `translate(${replyX}px, ${replyY}px)`,
                animationDelay: `${index * 0.1}s`,
              };
  
              return (
                <div key={index} className={styles.replyBubble} style={replyStyle}>
                  <span className={styles.replyText}>{reply.text}</span>
                  <div className={styles.replyLikes}>
                    <Heart size={12} />
                    <span>{reply.likes}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }