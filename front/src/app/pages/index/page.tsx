"use client";

import { useState, useEffect } from "react";
import BubbleVis from "../../components/BubbleVis/page";
import styles from "./index.module.css";
import { BubbleType2, BubbleType } from "@/app/data/types";

// APIから返ってきたデータを直接扱う型を定義
interface ApiMessage {
  id: string;
  text: string;
  likes: number;
  X: number;
  Y: number;
  float_time: number;
  created_at: string;
  school: number;
  reply: ApiReply[] | null;
}

interface ApiReply {
  id: string;
  text: string;
  likes: number;
  X: number;
  Y: number;
  float_time: number;
  created_at: string;
  school: number;
  reply: null; // ネストされたreplyはないと仮定
}

// APIレスポンス全体の型
interface ApiResponse {
  messages: ApiMessage[];
}

// APIの文字列レスポンスを手動でパースする関数
const manuallyParseResponse = (responseText: string): ApiResponse | null => {
  try {
    // まずは通常のJSON.parseを試みる
    return JSON.parse(responseText);
  } catch (e) {
    console.log("Standard JSON parse failed, trying manual parsing");
    
    // エラーが出た場合、手動でパースを試みる
    try {
      // サーバーから返される実際のレスポンスに基づいて調整
      // この部分は実際のレスポンス構造に合わせて修正する必要があります
      if (responseText.includes("\"messages\":[")) {
        // messagesキーを含む形式のJSONである場合
        return JSON.parse(responseText);
      } else {
        // messagesキーがない場合、自分で構築
        const messages = JSON.parse(responseText);
        return { messages: Array.isArray(messages) ? messages : [messages] };
      }
    } catch (manualError) {
      console.error("Manual parsing failed:", manualError);
      return null;
    }
  }
};

// 新しい変換関数
const convertToAppFormat = (apiMessage: ApiMessage): BubbleType2 => {
  // replyの変換
  const convertedReplies: BubbleType[] = [];
  
  if (apiMessage.reply && Array.isArray(apiMessage.reply)) {
    apiMessage.reply.forEach(reply => {
      // IDを適切な形式に変換
      const idParts = reply.id.split('-');
      const numericId = idParts.length > 0 ? 
        parseInt(idParts[0], 16) || Date.now() : 
        Date.now();
      
      const convertedReply: BubbleType = {
        id: numericId,
        text: reply.text,
        likes: reply.likes || 0,
        school: reply.school || 0,
        x: reply.X || 0,
        y: reply.Y || 0,
        date: new Date(reply.created_at || Date.now()),
        replies: []
      };
      
      convertedReplies.push(convertedReply);
    });
  }
  
  // メインの変換
  return {
    id: apiMessage.id,
    text: apiMessage.text,
    likes: apiMessage.likes || 0,
    position: {
      x: apiMessage.X || 0,
      y: apiMessage.Y || 0
    },
    type: apiMessage.school || 0,
    floatTime: apiMessage.float_time || 5.0,
    createdAt: new Date(apiMessage.created_at || Date.now()).toISOString(),
    replies: convertedReplies
  };
};

export default function Home() {
  const [data, setData] = useState<BubbleType2[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // データ取得関数
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // APIからのレスポンスを取得
      const response = await fetch('https://08ac-131-112-213-64.ngrok-free.app/messages');
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      // テキストとして応答を取得
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // 手動パース処理
      const parsedData = manuallyParseResponse(responseText);
      
      if (!parsedData) {
        throw new Error("Failed to parse response data");
      }
      
      console.log("Parsed data:", parsedData);
      
      // アプリケーション形式に変換
      const bubbleData: BubbleType2[] = parsedData.messages.map(convertToAppFormat);
      console.log("Converted data:", bubbleData);
      
      setData(bubbleData);
      setError(null);
      
    } catch (err) {
      console.error("Fetch error:", err);
      setError((err instanceof Error) ? err.message : String(err));
      
      // エラー時にはデモ用のバブルを表示
      if (data.length === 0) {
        setData([{
          id: "error",
          text: "データの読み込みエラー: " + (err instanceof Error ? err.message : String(err)),
          likes: 0,
          position: { x: 150, y: 150 },
          type: 0,
          floatTime: 0.3,
          createdAt: new Date().toISOString(),
          replies: []
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    
    // ポーリング設定
    const intervalId = setInterval(fetchData, 10000);
    
    // クリーンアップ
    return () => clearInterval(intervalId);
  }, []);
  
  const handleLike = async (id: string) => {
    // 楽観的UI更新
    setData((prevData) =>
      prevData.map((bubble) =>
        bubble.id === id ? { ...bubble, likes: (bubble.likes || 0) + 1 } : bubble
      )
    );
    
    // API呼び出しは将来的に実装
  };
  
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>デモ</h1>
        {isLoading && data.length === 0 ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <BubbleVis bubbles={data} onLike={handleLike} />
        )}
        {error && <div className={styles.error}>{error}</div>}
      </main>
    </div>
  );
}