import notion, { getPosts as getNotionPosts } from "./notion";

// 直接在这里实现 getPageContent，避免模块导入问题
async function getPageContent(pageId: string): Promise<string> {
  const blocks = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    blocks.push(...response.results);
    cursor = response.next_cursor;
  } while (cursor);

  return blocks
    .map((block: any) => notionBlockToMarkdown(block))
    .join("");
}

function notionBlockToMarkdown(block: any): string {
  const type = block.type;
  const content = block[type];

  switch (type) {
    case "paragraph":
      return content.rich_text?.[0]?.plain_text || "";
    case "heading_1":
      return `# ${content.rich_text?.[0]?.plain_text || ""}\n\n`;
    case "heading_2":
      return `## ${content.rich_text?.[0]?.plain_text || ""}\n\n`;
    case "heading_3":
      return `### ${content.rich_text?.[0]?.plain_text || ""}\n\n`;
    case "bulleted_list_item":
      return `- ${content.rich_text?.[0]?.plain_text || ""}\n`;
    default:
      return "";
  }
}

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
        const title = notionPost.properties?.Name?.title?.[0]?.plain_text || "无标题";
        const date = notionPost.created_time || "";
        const slug = title.replace(/\s+/g, "-").toLowerCase().substring(0, 50) || id;

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
          // 可选字段（目前为空，因为数据库没有这些属性）
          summary: "",
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

    return posts;
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
