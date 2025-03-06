'use client';
import type { BubbleType } from "./../../data/types";
import styles from "./Bubble.module.css";
import { Heart, Plus } from "lucide-react";
import { useEffect, useState, CSSProperties } from "react";
import ReplyModal from "./../replymodal/page";

interface BubbleProps {
    bubble: BubbleType;
    onLike: (id: number) => void;
    showReplies: boolean;
    toggleReplies: () => void;
    position: { x: number; y: number };
    onAddReply: (bubbleId: number, replyText: string) => void;
}

export default function Bubble({ 
    bubble, 
    onLike, 
    showReplies, 
    toggleReplies, 
    position,
    onAddReply 
}: BubbleProps) {
    const size = 100 + bubble.likes * 5;
    const [animationDelay, setAnimationDelay] = useState<string | null>(null);
    const [isClicked, setIsClicked] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeReplyIndex, setActiveReplyIndex] = useState(-1);

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

    // Calculate positions for the reply bubbles
    const replyRadius = size * 0.8;
    const calculateReplyPositions = (numReplies: number) => {
        return Array.from({ length: numReplies }, (_, i) => {
            const angle = (i * 2 * Math.PI) / numReplies;
            return {
                x: replyRadius * Math.cos(angle),
                y: replyRadius * Math.sin(angle),
            };
        });
    };

    const maxReplies = 8;
    const replyPositions = calculateReplyPositions(maxReplies);

    // Handle toggling the replies with animation
    const handleToggleReplies = () => {
        if (showReplies) {
            setIsClosing(true);
            setTimeout(() => {
                toggleReplies();
                setIsClosing(false);
            }, 400); // Match this to the disappear animation duration
        } else {
            setIsClicked(true);
            toggleReplies();
            setTimeout(() => {
                setIsClicked(false);
            }, 500); // Match this to the pulse animation duration
        }
    };

    const handleAddReply = (text: string) => {
        onAddReply(bubble.id, text);
        setShowModal(false);
    };

    const handleOpenModal = (index: number) => {
        setActiveReplyIndex(index);
        setShowModal(true);
    };

    // Determine where to place the plus button
    const getPlusButtonIndex = () => {
        return bubble.replies ? Math.min(bubble.replies.length, maxReplies - 1) : 0;
    };

    return (
        <>
            <div
                className={`${styles.bubbleContainer} ${isClicked ? styles.clicked : ''}`}
                style={bubbleStyle}
            >
                <div
                    className={`${styles.bubble} ${isClicked ? styles.clicked : ''}`}
                    onClick={handleToggleReplies}
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
        
                {(showReplies || isClosing) && (
                    <div className={`${styles.repliesContainer} ${isClosing ? styles.closing : ''}`}>
                        {replyPositions.map((position, index) => {
                            const reply = bubble.replies && index < bubble.replies.length 
                                ? bubble.replies[index] 
                                : null;
                            
                            const isPlusButton = index === getPlusButtonIndex() && 
                                (!bubble.replies || bubble.replies.length < maxReplies);
                            
                            return (
                                <div 
                                    key={index} 
                                    className={isPlusButton ? styles.plusBubble : styles.replyBubble}
                                    style={{
                                        position: 'absolute',
                                        width: `${50 + size / 4}px`,
                                        height: `${50 + size / 4}px`, 
                                        borderRadius: '50%',
                                        background: 'linear-gradient(to top, #6bffb5 0%, #6bffb5 0%)', 
                                        left: `${position.x + size / 2 - 25 - size / 8}px`,
                                        top: `${position.y + size / 2 - 25 - size / 8}px`,
                                        '--bubble-index': index,
                                        zIndex: 20002,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    } as CSSProperties}
                                    onClick={isPlusButton ? () => handleOpenModal(index) : undefined}
                                >
                                    {isPlusButton ? (
                                        <Plus size={24} color="#fff" />
                                    ) : reply ? (
                                        <span className={styles.replyText}>
                                            {reply.text}
                                        </span>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showModal && (
                <ReplyModal 
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddReply}
                />
            )}
        </>
    );
}