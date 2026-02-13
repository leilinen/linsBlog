import notion, { getPosts as getNotionPosts } from "./notion";
import { getPageContent } from "./notion-utils";

export interface Post {
  id: string;
  title: string;
  date: string;
  dateDisplay: string;
  slug: string;
  content?: string;
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const notionPosts = await getNotionPosts();

    const posts = await Promise.all(
      notionPosts.map(async (notionPost: any) => {
        const id = notionPost.id;
        const title =
          notionPost.properties.Title?.title?.[0]?.plain_text || "无标题";
        const date = notionPost.properties.Date?.date?.start || "";
        const slug =
          notionPost.properties.Slug?.rich_text?.[0]?.plain_text || id;

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
        };
      })
    );

    return posts;
  } catch (error) {
    console.error("Failed to fetch posts from Notion:", error);
    // 如果Notion不可用，返回空数组或使用备用数据
    return [];
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
