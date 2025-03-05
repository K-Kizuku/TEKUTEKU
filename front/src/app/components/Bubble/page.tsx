'use client';
import type { BubbleType } from "./../../data/types"
import styles from "./Bubble.module.css"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react";
import { CSSProperties } from "react";

interface BubbleProps {
    bubble: BubbleType;
    onLike: (id: number) => void;
    existingPositions: { x: number; y: number }[];
    showReplies: boolean;
    toggleReplies: () => void;
    position: { x: number; y: number };
}

export default function Bubble({
    bubble,
    onLike,
    showReplies,
    toggleReplies,
    position
}: BubbleProps) {
    const size = 50 + bubble.likes * 5;
    const [animationDelay, setAnimationDelay] = useState<string | null>(null);

    useEffect(() => {
        setAnimationDelay(`${Math.random() * 3}s`);
    }, []);

    const bubbleStyle = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        animationDelay: animationDelay || '0s',
    };

    const replies = bubble.replies || [];
    const replyRadius = size + 50; // Distance from main bubble

    // Function to calculate symmetrical positions for replies
    const calculateReplyPositions = (numReplies: number) => {
        const positions: { x: number, y: number, angle: number }[] = [];

        switch (numReplies) {
            case 1:
                // Single reply opposite the main bubble
                positions.push({ x: replyRadius, y: 0, angle: 0 });
                break;
            case 2:
                // Two replies on opposite sides
                positions.push({ x: replyRadius, y: 0, angle: 0 });
                positions.push({ x: -replyRadius, y: 0, angle: Math.PI });
                break;
            case 3:
                // Three replies forming a triangle around the main bubble
                const angles = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
                angles.forEach(angle => {
                    positions.push({
                        x: replyRadius * Math.cos(angle),
                        y: replyRadius * Math.sin(angle),
                        angle
                    });
                });
                break;
            case 4:
                // Four replies at compass points
                const compassAngles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
                compassAngles.forEach(angle => {
                    positions.push({
                        x: replyRadius * Math.cos(angle),
                        y: replyRadius * Math.sin(angle),
                        angle
                    });
                });
                break;
            default:
                // For more than 4 replies, distribute evenly in a circle
                for (let i = 0; i < numReplies; i++) {
                    const angle = (i * 2 * Math.PI) / numReplies;
                    positions.push({
                        x: replyRadius * Math.cos(angle),
                        y: replyRadius * Math.sin(angle),
                        angle
                    });
                }
        }

        return positions;
    };

    const replyPositions = calculateReplyPositions(replies.length);

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
                        const { x, y, angle } = replyPositions[index];

                        const connectionLineStyle: CSSProperties = {
                            position: 'absolute',
                            width: `${replyRadius * 2}px`,
                            height: '1px',
                            backgroundColor: '#e0e0e0',
                            transform: `rotate(${angle * (180 / Math.PI)}deg)`,
                            transformOrigin: '0% 50%',
                            zIndex: -1, // Ensure line is behind bubbles
                        };

                        const replyStyle : CSSProperties= {
                            position: 'absolute',
                            transform: `translate(${x}px, ${y}px)`,
                            animationDelay: `${index * 0.1}s`,
                        };

                        return (
                            <div key={index} className={styles.replyWrapper}>
                                {/* Connection line */}
                                <div style={connectionLineStyle}></div>
                                
                                {/* Reply bubble */}
                                <div className={styles.replyBubble} style={replyStyle}>
                                    <span className={styles.replyText}>{reply.text}</span>
                                    <div className={styles.replyLikes}>
                                        <Heart size={12} />
                                        <span>{reply.likes}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}