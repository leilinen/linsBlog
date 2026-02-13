import { Client } from "@notionhq/client";
import { getPageContent } from "./notion-utils";

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

export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await notion.search({
      filter: {
        property: "object",
        value: "page",
      },
      page_size: 50,
    });

    // 调试日志
    console.log("Notion search total results:", response.results.length);

    // 过滤出属于该数据库的页面
    const databaseId = process.env.NOTION_DATABASE_ID;
    const databasePages = response.results.filter((item: any) => {
      // 移除连字符后比较（Notion API 返回的 ID 带连字符，环境变量可能没有）
      const itemDbId = (item.parent?.database_id || "").replace(/-/g, "");
      const targetDbId = databaseId.replace(/-/g, "");
      const matches = itemDbId === targetDbId;
      if (!matches && item.parent?.database_id) {
        console.log(`Page ${item.id} parent database: ${item.parent.database_id}, target: ${databaseId}, normalized compare: ${itemDbId} === ${targetDbId}`);
      }
      return matches;
    });

    console.log("Filtered database pages:", databasePages.length);

    const posts = await Promise.all(
      databasePages.map(async (notionPost: any) => {
        const id = notionPost.id;

        console.log(`\n=== Processing page ${id} ===`);
        console.log(`Raw properties:`, JSON.stringify(notionPost.properties, null, 2));

        const title = notionPost.properties?.Name?.title?.[0]?.plain_text || "无标题";
        const date = notionPost.created_time || "";
        // 直接使用 Notion page ID 作为 slug（UUID 格式），避免中文字符编码问题
        const slug = id;

        // 使用完整的内容获取函数
        const content = await getPageContent(id);

        // 从 Notion 属性中读取数据
        const published = notionPost.properties?.Published?.checkbox ?? false;
        const status = notionPost.properties?.Status?.select?.name || "";
        const tags = notionPost.properties?.Tags?.multi_select?.map((t: any) => t.name) || [];
        const category = notionPost.properties?.Category?.select?.name || "";
        const featured = notionPost.properties?.Featured?.checkbox ?? false;
        // 直接从 Summary 属性读取，不使用 content fallback
        const summary = notionPost.properties?.Summary?.rich_text?.[0]?.plain_text || "";

        console.log(`Parsed values:`);
        console.log(`  title: "${title}"`);
        console.log(`  published: ${published}`);
        console.log(`  status: "${status}"`);
        console.log(`  category: "${category}"`);
        console.log(`  tags: [${tags.join(", ")}]`);
        console.log(`  content length: ${content?.length || 0}`);
        console.log(`  featured: ${featured}`);

        const postData = {
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
          updated: date,
          status,
          featured,
          readingTime: Math.ceil((content.length || 0) / 500),
          coverImage: "",
          published,
        };

        console.log(`Post ${title}: published=${published}, status=${status}`);

        return postData;
      })
    );

    console.log(`\nTotal posts before filter: ${posts.length}`);
    // 过滤只显示已发布的文章
    const publishedPosts = posts.filter((post) => post.published && post.status !== "归档");
    console.log(`Published posts after filter: ${publishedPosts.length}`);
    console.log(`Filtered out posts: ${posts.filter(p => !p.published || p.status === "归档").map(p => `"${p.title}" (published=${p.published}, status="${p.status}")`).join(", ")}\n`);

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
