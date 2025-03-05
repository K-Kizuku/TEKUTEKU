// pages/submit.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';

//

const SubmitPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [isSwiping, setIsSwiping] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === '') return;
    
    // 送信時にスワイプアニメーションを実行
    setIsSwiping(true);
    setTimeout(() => {
      // ここで API に投稿内容を送信する処理等を実装
      alert('投稿が送信されました！');
      setContent('');
      setIsSwiping(false);
      // 送信後、モニタ画面（index.tsx）へ遷移する例
      router.push('/');
    }, 500);
  };

  return (
    <div style={{padding: '20px'}}>
      <h1>投稿フォーム</h1>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="投稿内容を入力してください"
          rows={5}
          style={{width: '100%', padding: '10px'}}
        />
        <br/>
        <button type="submit" className="submit-button" style={{marginTop: '10px'}}>
          送信
        </button>
      </form>
      {isSwiping && (
        <div 
          className="bubble swipe-animation" 
          style={{
            width: 150, 
            height: 150, 
            margin: '20px auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default SubmitPage;