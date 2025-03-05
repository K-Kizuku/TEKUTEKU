import type { BubbleType } from "./types"

export const bubbleData: BubbleType[] = [
  {
    id: 1,
    text: "Next.jsはモダンなWebアプリケーションの構築に最適です！",
    likes: 42,
    replies: [
      { id: 101, text: "完全に同意します！", likes: 12 },
      { id: 102, text: "SSRの機能は革命的ですね", likes: 8 },
      { id: 103, text: "でもRemixの方が好きです", likes: 3 },
      { id: 104, text: "App Routerを試しましたか？", likes: 5 },
    ],
  },
  {
    id: 2,
    text: "TypeScriptは開発体験を大きく改善してくれました",
    likes: 28,
    replies: [
      { id: 201, text: "型安全性は学習コストを上回ります", likes: 9 },
      { id: 202, text: "今はプレーンなJavaScriptには戻れません", likes: 7 },
    ],
  },
  {
    id: 3,
    text: "CSS Modulesはコンポーネントスコープのスタイリングに最適です",
    likes: 15,
    replies: [
      { id: 301, text: "クラス名の衝突がなくなります！", likes: 4 },
      { id: 302, text: "Tailwind CSSの方が好きです", likes: 11 },
      { id: 303, text: "Styled Componentsも良い選択肢です", likes: 6 },
    ],
  },
  {
    id: 4,
    text: "Reactの状態管理で一番好きなものは何ですか？",
    likes: 33,
    replies: [
      { id: 401, text: "Redux Toolkit", likes: 8 },
      { id: 402, text: "Zustandはシンプルで良い", likes: 12 },
      { id: 403, text: "Context APIで十分な場合もあります", likes: 7 },
      { id: 404, text: "Jotaiはアトミック状態管理に最適", likes: 5 },
    ],
  },
  {
    id: 5,
    text: "2023年にWeb開発を学ぶのは時々圧倒されます",
    likes: 56,
    replies: [
      { id: 501, text: "まず基本を学ぶことが大切です", likes: 18 },
      { id: 502, text: "1つのフレームワークを選んでマスターしましょう", likes: 14 },
      { id: 503, text: "休憩を取って燃え尽き症候群を防ぎましょう", likes: 22 },
    ],
  },
  {
    id: 6,
    text: "Reactの良いUIコンポーネントライブラリは何ですか？",
    likes: 19,
    replies: [
      { id: 601, text: "Material UIは包括的です", likes: 7 },
      { id: 602, text: "Chakra UIはアクセシビリティに優れています", likes: 9 },
      { id: 603, text: "shadcn/uiは最近のお気に入りです", likes: 11 },
    ],
  },
  {
    id: 7,
    text: "初めてNext.jsアプリをVercelにデプロイしました！",
    likes: 38,
    replies: [
      { id: 701, text: "おめでとう！何を作ったのですか？", likes: 5 },
      { id: 702, text: "Vercelのデプロイはとてもスムーズです", likes: 13 },
      { id: 703, text: "リンクをシェアしてください！", likes: 8 },
    ],
  },
  {
    id: 8,
    text: "アニメーションにFramer Motionを使っている人いますか？",
    likes: 22,
    replies: [
      { id: 801, text: "複雑なアニメーションに最適です", likes: 6 },
      { id: 802, text: "APIがとても直感的です", likes: 4 },
    ],
  },
]
