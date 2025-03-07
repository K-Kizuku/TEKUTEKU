'use client';
import { useState, useEffect } from 'react';
import styles from './replyModal.module.css';

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export default function ReplyModal({ isOpen, onClose, onSubmit }: ReplyModalProps) {
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    // Add event listener to close modal when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains(styles.modalOverlay)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onSubmit(replyText);
      setReplyText('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <h3>Add Reply</h3>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.replyTextarea}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply here..."
            rows={4}
            maxLength={100}
            autoFocus
          />
          
          <div className={styles.modalActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!replyText.trim()}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}