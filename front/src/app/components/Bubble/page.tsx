'use client';
import type { BubbleType } from "./../../data/types";
import styles from "./Bubble.module.css";
import { Heart } from "lucide-react";
import { useEffect, useState, CSSProperties } from "react";

interface BubbleProps {
    bubble: BubbleType;
    onLike: (id: number) => void;
    showReplies: boolean;
    toggleReplies: () => void;
    position: { x: number; y: number };
}

export default function Bubble({ bubble, onLike, showReplies, toggleReplies, position }: BubbleProps) {
    const size = 50 + bubble.likes * 5;
    const [animationDelay, setAnimationDelay] = useState<string | null>(null);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        setAnimationDelay(`${Math.random() * 3}s`);
    }, []);

    const bubbleStyle: CSSProperties = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        animationDelay: animationDelay || '0s',
        zIndex: isClicked ? 9999 : 1,
    };

    // 8個の円を表示するための計算
    const replyRadius = size + 50;
    const calculateReplyPositions = (numReplies: number) => {
        return Array.from({ length: numReplies }, (_, i) => {
            const angle = (i * 2 * Math.PI) / numReplies;
            return {
                x: replyRadius * Math.cos(angle),
                y: replyRadius * Math.sin(angle),
                angle,
            };
        });
    };

    // 8個の円に対応する位置を計算
    const replyPositions = calculateReplyPositions(8);

    return (
        <div className={styles.bubbleContainer} style={bubbleStyle}>
            <div
                className={styles.bubble}
                onClick={() => {
                    setIsClicked(!isClicked);
                    toggleReplies();
                }}
            >
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

            {showReplies && (
                <div className={styles.repliesContainer}>
                    {/* 8個の円に対応する円を表示 */}
                    {replyPositions.map((position, index) => (
                        <div key={index} className={styles.replyWrapper}>
                            <div
                                style={{
                                    position: 'absolute',
                                    width: `${replyRadius * 2}px`,
                                    height: '1px',
                                    backgroundColor: '#e0e0e0',
                                    transform: `rotate(${position.angle * (180 / Math.PI)}deg)`,
                                    transformOrigin: '0% 50%',
                                    zIndex: -1,
                                }}
                            ></div>

                            <div
                                className={styles.replyBubble}
                                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                            >
                                <span className={styles.replyText}>Reply {index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
