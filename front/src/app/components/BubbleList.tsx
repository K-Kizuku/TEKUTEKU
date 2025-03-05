// components/BubbleList.tsx
import React from 'react';
import Bubble from './Bubble';
import { BubbleData } from '../types';

interface BubbleListProps {
  bubbles: BubbleData[];
}

const BubbleList: React.FC<BubbleListProps> = ({ bubbles }) => {
  return (
    <div style={{position: 'relative', width: '100%', height: '100vh'}}>
      {bubbles.map((bubble) => (
        <Bubble 
          key={bubble.id}
          id={bubble.id}
          content={bubble.content}
          likes={bubble.likes}
          replies={bubble.replies}
          timestamp={bubble.timestamp}
        />
      ))}
    </div>
  );
};

export default BubbleList;