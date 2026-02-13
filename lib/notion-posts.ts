import notion, { getPosts as getNotionPosts } from "./notion";
import { getPageContent } from "./notion-utils";

export interface Post {
  id: string;
  title: string;
  date: string;
  dateDisplay: string;
  slug: string;
  content?: string;

  // 新增字段
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

export async function getAllPosts(): Promise<Post[]> {
  try {
    const notionPosts = await getNotionPosts();

    const posts = await Promise.all(
      notionPosts.map(async (notionPost: any) => {
        const id = notionPost.id;
        const title =
          notionPost.properties.Title?.title?.[0]?.plain_text || "无标题";
        const slug =
          notionPost.properties.Slug?.rich_text?.[0]?.plain_text || id;
        const date = notionPost.properties.Date?.date?.start || "";
        const published = notionPost.properties.Published?.checkbox !== false;

        // 可选字段
        const summary =
          notionPost.properties.Summary?.rich_text?.[0]?.plain_text || "";
        const tags = notionPost.properties.Tags?.multi_select?.map(
          (t: any) => t.name
        ) || [];
        const category = notionPost.properties.Category?.select?.name || "";
        const updated = notionPost.properties.Updated?.date?.start || "";
        const status = notionPost.properties.Status?.select?.name || "";
        const featured = notionPost.properties.Featured?.checkbox || false;
        const readingTime = notionPost.properties["Reading Time"]?.number || 0;
        const coverImage = notionPost.properties["Cover Image"]?.url || "";

        // 获取页面内容
        let content = "";
        try {
          content = await getPageContent(id);
        } catch (error) {
          console.error(`Failed to fetch content for ${slug}:`, error);
        }

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
          summary,
          tags,
          category,
          updated,
          status,
          featured,
          readingTime,
          coverImage,
          published,
        };
      })
    );

    // 过滤只显示已发布的文章
    const publishedPosts = posts.filter(
      (post) => post.published && post.status !== "归档"
    );

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
