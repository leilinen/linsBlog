import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

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

// 简化版：只获取第一块作为内容
async function getPageContentSimple(pageId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 1,
    });

    if (response.results.length > 0) {
      const block = response.results[0] as any;
      if (block?.type === "paragraph") {
        return block.paragraph.rich_text?.[0]?.plain_text || "";
      } else if (block?.type === "heading_1") {
        return `# ${block.heading_1.rich_text?.[0]?.plain_text || ""}\n\n`;
      }
    }
    return "";
  } catch (error) {
    console.error(`Failed to fetch content for ${pageId}:`, error);
    return "";
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await notion.search({
      filter: {
        property: "object",
        value: "page",
      },
      page_size: 50,
    });

    // 过滤出属于该数据库的页面
    const databaseId = process.env.NOTION_DATABASE_ID;
    const databasePages = response.results.filter((item) => {
      return item.parent?.database_id === databaseId;
    });

    const posts = await Promise.all(
      databasePages.map(async (notionPost: any) => {
        const id = notionPost.id;
        const title = notionPost.properties?.Name?.title?.[0]?.plain_text || "无标题";
        const date = notionPost.created_time || "";
        const slug = title.replace(/\s+/g, "-").toLowerCase().substring(0, 50) || id;

        // 使用简化版的内容获取
        const content = await getPageContentSimple(id);

        return {
          id,
          title,
          date,
          dateDisplay: date
            ? new Date(date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
            : "",
          slug,
          content,
          summary: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
          tags: [],
          category: "",
          updated: date,
          status: "已发布",
          featured: false,
          readingTime: Math.ceil((content.length || 0) / 500),
          coverImage: "",
          published: true,
        };
      })
    );

    // 过滤只显示已发布的文章
    const publishedPosts = posts.filter((post) => post.published && post.status !== "归档");

    return publishedPosts;
  } catch (error) {
    console.error("Failed to fetch posts from Notion:", error);
    return [];
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
