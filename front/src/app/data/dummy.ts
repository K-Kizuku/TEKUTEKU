import type { BubbleType } from "./types"

export const bubbleData: BubbleType[] = [
  {
    id: 1,
    text: "Next.js is amazing for building modern web applications!",
    likes: 42,
    replies: [
      { id: 101, text: "I totally agree!", likes: 12 },
      { id: 102, text: "The SSR capabilities are game-changing", likes: 8 },
      { id: 103, text: "I prefer Remix though", likes: 3 },
      { id: 104, text: "Have you tried the App Router?", likes: 5 },
    ],
  },
  {
    id: 2,
    text: "TypeScript has improved my development experience so much",
    likes: 28,
    replies: [
      { id: 201, text: "Type safety is worth the learning curve", likes: 9 },
      { id: 202, text: "I can't go back to plain JavaScript now", likes: 7 },
    ],
  },
  {
    id: 3,
    text: "CSS Modules are great for component-scoped styling",
    likes: 15,
    replies: [
      { id: 301, text: "No more class name conflicts!", likes: 4 },
      { id: 302, text: "I prefer Tailwind CSS", likes: 11 },
      { id: 303, text: "Styled Components are also a good option", likes: 6 },
    ],
  },
  {
    id: 4,
    text: "What's your favorite React state management solution?",
    likes: 33,
    replies: [
      { id: 401, text: "Redux Toolkit", likes: 8 },
      { id: 402, text: "Zustand is simpler", likes: 12 },
      { id: 403, text: "Context API is enough for most apps", likes: 7 },
      { id: 404, text: "Jotai for atomic state", likes: 5 },
    ],
  },
  {
    id: 5,
    text: "Learning web development in 2023 feels overwhelming sometimes",
    likes: 56,
    replies: [
      { id: 501, text: "Focus on fundamentals first", likes: 18 },
      { id: 502, text: "Pick one framework and master it", likes: 14 },
      { id: 503, text: "Take breaks to avoid burnout", likes: 22 },
    ],
  },
  {
    id: 6,
    text: "What's a good UI component library for React?",
    likes: 19,
    replies: [
      { id: 601, text: "Material UI is comprehensive", likes: 7 },
      { id: 602, text: "Chakra UI has great accessibility", likes: 9 },
      { id: 603, text: "shadcn/ui is my new favorite", likes: 11 },
    ],
  },
  {
    id: 7,
    text: "I just deployed my first Next.js app to Vercel!",
    likes: 38,
    replies: [
      { id: 701, text: "Congrats! What did you build?", likes: 5 },
      { id: 702, text: "Vercel deployment is so smooth", likes: 13 },
      { id: 703, text: "Share the link!", likes: 8 },
    ],
  },
  {
    id: 8,
    text: "Anyone using Framer Motion for animations?",
    likes: 22,
    replies: [
      { id: 801, text: "It's amazing for complex animations", likes: 6 },
      { id: 802, text: "The API is so intuitive", likes: 4 },
    ],
  },
]

