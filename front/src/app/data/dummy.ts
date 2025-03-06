import type { BubbleType } from "./types"

export const bubbleData: BubbleType[] = [
  {
    id: 1,
    school:1,
    text: "Next.jsはモダンなWebアプリケーションの構築に最適です！",
    likes: 12,
    x: 200,
    y: 400,
    date: new Date(),
    replies: [
      { id: 101, text: "完全に同意します！" },
      { id: 102, text: "SSRの機能は革命的ですね" },
      { id: 103, text: "でもRemixの方が好きです" },
      { id: 104, text: "App Routerを試しましたか？" },
    ],
  },
  {
    id: 2,
    school:2,
    text: "TypeScriptは開発体験を大きく改善してくれました",
    likes: 8,
    x: 400,
    y: 250,
    date: new Date(),
    replies: [
      { id: 201, text: "型安全性は学習コストを上回ります" },
      { id: 202, text: "今はプレーンなJavaScriptには戻れません" },
    ],
  },
  {
    id: 3,
    school:1,
    text: "CSS Modulesはコンポーネントスコープのスタイリングに最適です",
    likes: 15,
    x: 600,
    y: 90,
    date: new Date(),
    replies: [
      { id: 301, text: "クラス名の衝突がなくなります！" },
      { id: 302, text: "Tailwind CSSの方が好きです" },
      { id: 303, text: "Styled Componentsも良い選択肢です" },
    ],
  },
  {
    id: 4,
    school:2,
    text: "Reactの状態管理で一番好きなものは何ですか？",
    likes: 13,
    x: 1000,
    y: 500,
    date: new Date(),
    replies: [
      { id: 401, text: "Redux Toolkit" },
      { id: 402, text: "Zustandはシンプルで良い" },
      { id: 403, text: "Context APIで十分な場合もあります" },
      { id: 404, text: "Jotaiはアトミック状態管理に最適" },
    ],
  },
  {
    id: 5,
    school:1,
    text: "2023年にWeb開発を学ぶのは時々圧倒されます",
    likes: 20,
    x: 700,
    y: 290,
    date: new Date(),
    replies: [
      { id: 501, text: "まず基本を学ぶことが大切です" },
      { id: 502, text: "1つのフレームワークを選んでマスターしましょう" },
      { id: 503, text: "休憩を取って燃え尽き症候群を防ぎましょう" },
    ],
  },
  {
    id: 6,
    school:2,
    text: "Reactの良いUIコンポーネントライブラリは何ですか？",
    likes: 2,
    x: 1300,
    y: 100,
    date: new Date(),
    replies: [
      { id: 601, text: "Material UIは包括的です" },
      { id: 602, text: "Chakra UIはアクセシビリティに優れています" },
      { id: 603, text: "shadcn/uiは最近のお気に入りです" },
    ],
  },
  {
    id: 7,
    school:1,
    text: "初めてNext.jsアプリをVercelにデプロイしました！",
    likes: 18,
    x: 1200,
    y: 300,
    date: new Date(),
    replies: [
      { id: 701, text: "おめでとう！何を作ったのですか？" },
      { id: 702, text: "Vercelのデプロイはとてもスムーズです" },
      { id: 703, text: "リンクをシェアしてください！" },
    ],
  },
  {
    id: 8,
    school:2,
    text: "アニメーションにFramer Motionを使っている人いますか？",
    likes: 22,
    x: 130,
    y: 140,
    date: new Date(),
    replies: [
      { id: 801, text: "複雑なアニメーションに最適です" },
      { id: 802, text: "APIがとても直感的です" },
    ],
  },
  {
    id: 10,
    school:1,
    text: "新しい細胞です",
    likes: 0,
    x: 1100,
    y: 100,
    date: new Date(),
    
  },
];


export const newbubbleData: BubbleType[] = [
    {
      id: 10,
      school:1,
      text: "新しい細胞です",
      likes: 0,
      x: 1100,
      y: 100,
      date: new Date(),
      
    },
];