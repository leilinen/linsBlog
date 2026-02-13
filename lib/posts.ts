// 智能选择数据源：优先使用Notion，失败时使用备用数据
import { getAllPosts as getNotionAllPosts, Post as NotionPost } from "./notion-posts";

export interface Post {
  id: string;
  title: string;
  date: string;
  dateDisplay: string;
  slug: string;
  content?: string;
  summary?: string;
  tags?: string[];
  category?: string;
  updated?: string;
  status?: string;
  featured?: boolean;
  readingTime?: number;
  coverImage?: string;
  published?: boolean;
}

// 备用数据（硬编码，用于Notion未配置时）
const fallbackPosts: Post[] = [
  {
    id: "1",
    title: "十年谢幕；苏打汽水～",
    date: "2026-02-11",
    dateDisplay: "2026-2-11",
    slug: "ten-years",
    summary: "十年前的今天，我开始了一段旅程...",
    tags: ["思考", "生活"],
    category: "生活",
    status: "已发布",
    featured: true,
    readingTime: 5,
    published: true,
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
    summary: "关于阿凡达和现代社会的思考",
    tags: ["思考", "观察"],
    category: "看天下",
    status: "已发布",
    readingTime: 8,
    published: true,
    content: `# 君子善假于物，行者直指本心

关于阿凡达和现代社会的思考...`
  },
];

export async function getAllPosts(): Promise<Post[]> {
  // 检查是否配置了Notion
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.log("Notion not configured, using fallback data");
    return fallbackPosts;
  }

  try {
    const notionPosts = await getNotionAllPosts();
    if (notionPosts.length > 0) {
      console.log(`Loaded ${notionPosts.length} posts from Notion`);
      return notionPosts;
    } else {
      console.log("No posts in Notion, using fallback data");
      return fallbackPosts;
    }
  } catch (error) {
    console.error("Failed to load posts from Notion, using fallback:", error);
    return fallbackPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category === category);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags?.includes(tag));
}

export async function getFeaturedPosts(limit?: number): Promise<Post[]> {
  const posts = await getAllPosts();
  const featured = posts.filter((post) => post.featured);
  return limit ? featured.slice(0, limit) : featured;
}

const POSTS_PER_PAGE = 7;

export async function getPaginatedPosts(page: number = 1) {
  const posts = await getAllPosts();
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
