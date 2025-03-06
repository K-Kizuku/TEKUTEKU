"use client";

import { FormEvent, useState } from "react";
import styles from "./post.module.css";

export default function PostPage() {
  const [content, setContent] = useState("");
  const [previewBubble, setPreviewBubble] = useState<string | null>(null);
  const [bubbleAnimating, setBubbleAnimating] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [pointerStartY, setPointerStartY] = useState<number | null>(null);
  const [hintText, setHintText] = useState("上にスワイプしてバブルを送信");

  // 送信ボタン押下時、入力内容をバブルプレビューとして表示
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content.trim() === "") return;
    setPreviewBubble(content);
    setContent("");
    setDragOffset(0);
    // 初期状態のヒントに戻す
    setHintText("上にスワイプしてバブルを送信");
  };

  // pointer（タッチ／マウス）開始時、キャプチャ設定と開始位置（Y座標）の記録
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setPointerStartY(e.clientY);
  };

  // pointer 移動時、Y軸方向のみ移動量を更新（ドラッグ中のみ追従）
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartY === null) return;
    const offsetY = e.clientY - pointerStartY;
    setDragOffset(offsetY);
    // 下方向には移動させない（offsetYが正の場合は0とする）
    const safeOffset = offsetY < 0 ? offsetY : 0;
    // しきい値（ここでは -300px 以上移動で送信可能）を超えたらヒントを更新
    if (safeOffset < -300) {
      setHintText("指を離して送信");
    } else {
      setHintText("上にスワイプしてバブルを送信");
    }
  };

  // pointer 終了時、キャプチャ解除、上方向に十分移動していれば送信、そうでなければ元の位置に戻す
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragOffset < -300) {
      submitBubble();
    } else {
      setDragOffset(0);
      setHintText("上にスワイプしてバブルを送信");
    }
    setPointerStartY(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // バブル送信処理（送信時は上方向へアニメーションし、バブルを非表示にする）
  const submitBubble = () => {
    setBubbleAnimating(true);
    // ヒントを「送信済み」に変更
    setHintText("送信済み");
    setTimeout(() => {
      console.log("Bubble submitted:", previewBubble);
      setPreviewBubble(null);
      setBubbleAnimating(false);
      setDragOffset(0);
    }, 1000); // CSS のアニメーション時間と合わせる
  };

  // ドラッグ中の場合のみ、dragOffset が初期位置より下（正の値）にならないように制限
  const safeOffset = dragOffset < 0 ? dragOffset : 0;
  const bubbleTransform =
    bubbleAnimating
      ? "translateX(-50%) translateY(-100vh)"
      : pointerStartY !== null
      ? `translateX(-50%) translateY(${safeOffset}px)`
      : "translateX(-50%) translateY(0px)";


  return (
    <div className={styles.container}>
      {/* 背景の流れ星エフェクト */}
      <div className={styles.shootingStars}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={styles.shootingStar}></div>
        ))}
      </div>

      {previewBubble && (
        <>
          {/* ヒントテキスト */}
          <div className={styles.hint}>{hintText}</div>
          <div
            className={styles.bubblePreview}
            style={{ transform: bubbleTransform }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className={styles.bubbleContent}>{previewBubble}</div>
          </div>
        </>
      )}

      <form className={styles.postEditArea} onSubmit={handleSubmit}>
        <textarea
          className={styles.textbox}
          placeholder="バブル投稿を入力してください"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit" className={styles.button}>
          送信
        </button>
      </form>
    </div>
  );
}