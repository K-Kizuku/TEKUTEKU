// components/Bubble.tsx
import React, { useEffect, useState } from 'react';
import { BubbleData } from '../types';

interface BubbleProps extends BubbleData {}

const Bubble: React.FC<BubbleProps> = ({ id, content, likes, replies, timestamp }) => {
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);

  // いいね数・返信数に応じてバブルの基本サイズを計算（最小サイズは 100px）
  const size = Math.max(100, 100 + (likes + replies) * 10);
  
  // バブルが時間経過とともに縮小・フェードアウトする効果
  useEffect(() => {
    const now = Date.now();
    const age = now - timestamp;
    const lifespan = 60000; // 60秒で完全に縮小／フェードアウトすると仮定
    if(age > lifespan) {
      setOpacity(0);
      setScale(0.5);
    } else {
      const newScale = 1 - (age / lifespan) * 0.5; // 最大で 0.5 倍に縮小
      setScale(newScale);
      setOpacity(1 - (age / lifespan));
    }
  }, [timestamp]);

  return (
    <div 
      className="bubble"
      style={{
        width: size,
        height: size,
        transform: `scale(${scale})`,
        opacity: opacity,
      }}
    >
      <div style={{textAlign: 'center'}}>
        <p>{content}</p>
        <p style={{fontSize: '12px'}}>👍 {likes} 💬 {replies}</p>
      </div>
    </div>
  );
};

export default Bubble;