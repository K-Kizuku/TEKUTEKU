// pages/index.tsx
import React, { useEffect, useState } from 'react';
import BubbleList from '../components/BubbleList';
import { BubbleData } from '../types';

const MonitorPage: React.FC = () => {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  useEffect(() => {
    // API等からデータ取得する処理に置き換えてください
    const dummyBubbles: BubbleData[] = [
      { id: 1, content: "こんにちは、A大学からの投稿です！", likes: 5, replies: 2, timestamp: Date.now() - 10000 },
      { id: 2, content: "初めまして、B大学の学生です。", likes: 2, replies: 1, timestamp: Date.now() - 20000 },
      { id: 3, content: "面白いテーマですね！", likes: 10, replies: 5, timestamp: Date.now() - 30000 },
    ];
    setBubbles(dummyBubbles);
  }, []);

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>モニタ表示（他大学の投稿）</h1>
      <BubbleList bubbles={bubbles} />
    </div>
  );
};

export default MonitorPage;