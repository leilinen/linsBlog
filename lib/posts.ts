export interface Post {
  id: string;
  title: string;
  date: string;
  dateDisplay: string;
  slug: string;
  content?: string;
}

export { type Post };

export const posts: Post[] = [
  {
    id: "1",
    title: "十年谢幕；苏打汽水～",
    date: "2026-02-11",
    dateDisplay: "2026-2-11",
    slug: "ten-years",
    content: `# 十年谢幕；苏打汽水～

这是第一篇测试文章的正文内容。

## 小标题

这里是一些段落内容...

- 列表项1
- 列表项2
- 列表项3

还有更多内容待补充...`
  },
  {
    id: "2",
    title: "君子善假于物，行者直指本心｜从阿凡达灰烬到现代社会中自觉之路的讨论_15.ylog",
    date: "2026-01-28",
    dateDisplay: "2026-1-28",
    slug: "avatar",
    content: `# 君子善假于物，行者直指本心

关于阿凡达和现代社会的思考...`
  },
  {
    id: "3",
    title: "橡果子",
    date: "2026-01-28",
    dateDisplay: "2026-1-28",
    slug: "acorn",
    content: `# 橡果子

关于橡果子的思考...`
  },
  {
    id: "4",
    title: "我的修行，是睡觉放松玩",
    date: "2026-01-21",
    dateDisplay: "2026-1-21",
    slug: "my-practice",
    content: `# 我的修行，是睡觉放松玩

关于修行的思考...`
  },
  {
    id: "5",
    title: "最后一次更新这款眼镜框了！",
    date: "2026-01-13",
    dateDisplay: "2026-1-13",
    slug: "glasses",
    content: `# 最后一次更新这款眼镜框了！

关于眼镜框的设计...`
  },
  {
    id: "6",
    title: "你脸上是摄像头吗？",
    date: "2026-01-04",
    dateDisplay: "2026-1-4",
    slug: "camera-face",
    content: `# 你脸上是摄像头吗？

关于隐私和科技的思考...`
  },
  {
    id: "7",
    title: "[设计思维] 2 clicks x7 per week",
    date: "2025-12-27",
    dateDisplay: "2025-12-27",
    slug: "2clicks",
    content: `# [设计思维] 2 clicks x7 per week

关于设计思维的思考...`
  },
  {
    id: "8",
    title: "设计中的留白艺术",
    date: "2025-12-20",
    dateDisplay: "2025-12-20",
    slug: "white-space",
    content: `# 设计中的留白艺术

关于留白艺术的思考...`
  },
  {
    id: "9",
    title: "阅读笔记：设计心理学",
    date: "2025-12-15",
    dateDisplay: "2025-12-15",
    slug: "design-psychology",
    content: `# 阅读笔记：设计心理学

设计心理学读书笔记...`
  },
  {
    id: "10",
    title: "Minimalism in Modern Web Design",
    date: "2025-12-10",
    dateDisplay: "2025-12-10",
    slug: "minimalism-web",
    content: `# Minimalism in Modern Web Design

极简主义网页设计...`
  },
  {
    id: "11",
    title: "色彩搭配基础指南",
    date: "2025-12-05",
    dateDisplay: "2025-12-5",
    slug: "color-guide",
    content: `# 色彩搭配基础指南

色彩搭配基础知识...`
  },
  {
    id: "12",
    title: "Typography for the Web",
    date: "2025-11-28",
    dateDisplay: "2025-11-28",
    slug: "web-typography",
    content: `# Typography for the Web

网页排版设计...`
  },
  {
    id: "13",
    title: "响应式设计的实践与思考",
    date: "2025-11-20",
    dateDisplay: "2025-11-20",
    slug: "responsive-design",
    content: `# 响应式设计的实践与思考

响应式设计思考...`
  },
  {
    id: "14",
    title: "用户体验设计的核心原则",
    date: "2025-11-15",
    dateDisplay: "2025-11-15",
    slug: "ux-principles",
    content: `# 用户体验设计的核心原则

UX设计原则...`
  },
  {
    id: "15",
    title: "设计系统构建指南",
    date: "2025-11-10",
    dateDisplay: "2025-11-10",
    slug: "design-system",
    content: `# 设计系统构建指南

设计系统构建...`
  }
];

const POSTS_PER_PAGE = 7;

export function getPaginatedPosts(page: number = 1) {
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return {
    posts: paginatedPosts,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
