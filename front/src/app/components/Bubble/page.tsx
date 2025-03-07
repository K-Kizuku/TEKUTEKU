'use client';
import type { BubbleType2 } from "./../../data/types";
import styles from "./Bubble.module.css";
import { Heart, Plus } from "lucide-react";
import { useEffect, useState, CSSProperties } from "react";
import ReplyModal from "./../replymodal/page";

interface BubbleProps {
    bubble: BubbleType2;
    onLike: (id: string) => void;
    showReplies: boolean;
    toggleReplies: () => void;
    onAddReply: (bubbleId: string, replyText: string) => void;
    isNew?: boolean;
}

export default function Bubble({ 
    bubble, 
    onLike, 
    showReplies, 
    toggleReplies, 
    onAddReply,
    isNew = false
    
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
        left: `${bubble.position.x}px`,
        top: `${bubble.position.y}px`,
        animationDelay: animationDelay || '0s',
        zIndex: isClicked ? 9999 : 1,
        borderRadius: '50%',
        background: bubble.type === 1 
            ? 'radial-gradient(#96fbc4 50%, #f9f586 100%)' 
            : 'radial-gradient(#f9f586 55%, #96fbc4 100%)',
        
    };

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

    const handleToggleReplies = () => {
        if (showReplies) {
            setIsClosing(true);
            setTimeout(() => {
                toggleReplies();
                setIsClosing(false);
            }, 400);
        } else {
            setIsClicked(true);
            toggleReplies();
            setTimeout(() => {
                setIsClicked(false);
            }, 500);
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

    const getPlusButtonIndex = () => {
        return bubble.replies ? Math.min(bubble.replies.length, maxReplies - 1) : 0;
    };

      
      // Apply animation class if this is a new bubble
      const bubbleClassName = `${styles.bubble} ${isNew ? styles.newBubble : ''}`;

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
                                        background: bubble.type === 1 
                                            ? 'linear-gradient(to top, #f9f586 0%, #f9f586 100%)' 
                                            : 'linear-gradient(to top, #96fbc4 0%, #96fbc4 100%)', 
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
