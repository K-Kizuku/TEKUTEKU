"use client";

import { useState, useEffect } from "react";
import BubbleVis from "../../components/BubbleVis/page";
import styles from "./index.module.css";
import { BubbleType2 } from "@/app/data/types";

export default function Home() {
  const [data, setData] = useState<BubbleType2[]>([]);  // バブルデータの状態管理

  // APIからデータを取得
  const fetchData = async () => {
    try {
      const response = await fetch('https://32a1-2405-6581-1420-4300-8823-37ad-1916-ec71.ngrok-free.app');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      // APIの `messages` 配列を `BubbleType` の形式に変換
      const bubbleData: BubbleType2[] = jsonData.messages.map((msg: any) => ({
        id: msg.id,  // id は string のまま
        text: msg.text,
        likes: msg.likes ?? 0,  // likesがない場合、0を設定
        position: { x: msg.X, y: msg.Y }, // X, Y を position にマッピング
        type: msg.school, // school を type に
        replies: [] // API にリプライデータがないため、空配列をセット
      }));

      setData(bubbleData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);  // 10秒ごとにデータを再取得
    return () => clearInterval(intervalId);
  }, []);

  // いいねボタンの処理
  const handleLike = (id: string) => {
    setData((prevData) =>
      prevData.map((bubble) =>
        bubble.id === id ? { ...bubble, likes: (bubble.likes ?? 0) + 1 } : bubble
      )
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>デモ</h1>
        <BubbleVis bubbles={data} onLike={handleLike} />
      </main>
    </div>
  );
}
