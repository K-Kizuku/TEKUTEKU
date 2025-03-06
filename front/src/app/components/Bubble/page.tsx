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
    const replyRadius = size*0.8;
    const calculateReplyPositions = (numReplies: number) => {
        return Array.from({ length: numReplies }, (_, i) => {
            const angle = (i * 2 * Math.PI) / numReplies;
            return {
                x: replyRadius * Math.cos(angle),
                y: replyRadius * Math.sin(angle),
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



            {/* 8個の円だけを表示 */}

            {showReplies && (
    <div className={styles.repliesContainer} style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {replyPositions.map((position, index) => {
            const reply = bubble.replies ? bubble.replies[index] : null;
            return (
                <div key={index}
                     style={{
                         position: 'absolute',
                         width: `${50 + size / 4}px`,  // 円の直径
                         height: `${50 + size / 4}px`, // 円の直径
                         borderRadius: '50%', // 円を表示するためのスタイル
                         backgroundColor: '#f7c8ec', // 円の色
                         left: `${position.x + size / 2 - 25 - size / 8}px`,  // container center offset
                         top: `${position.y + size / 2 - 25 - size / 8}px`,  // container center offset
                     }}
                >
                    {/* テキストを円の中心に配置 */}
                    {reply && (
                        <span className={styles.replyText} style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)', // 中央揃え
                        }}>
                            {reply.text}
                        </span>
                    )}
                </div>
            );
        })}
    </div>
)}


        </div>
    );
}
