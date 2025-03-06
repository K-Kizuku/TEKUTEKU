"use client";

import { FormEvent } from "react";
import styles from "./post.module.css";

export default function PostPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ここに送信処理を記述
    console.log("送信されました");
  };

  return (
    <div className={styles.container}>
      {/* 他のコンテンツがあればここに配置 */}

      <form className={styles.postEditArea} onSubmit={handleSubmit}>
        <textarea
          className={styles.textbox}
          placeholder="バブル投稿を入力してください"
        ></textarea>

        <button type="submit" className={styles.button}>
          送信
        </button>
      </form>
    </div>
  );
}