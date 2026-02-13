// 智能选择数据源：优先使用Notion，失败时使用备用数据
import { getAllPosts as getNotionAllPosts } from "./notion-posts";

export interface Post {
  id: string;
  title: string;
  date: string;
  dateDisplay: string;
  slug: string;
  content?: string;
}

// 备用数据（硬编码，用于Notion未配置时）
const fallbackPosts: Post[] = [
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
