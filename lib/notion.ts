import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default notion;

export async function getDatabase() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }

  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });

  return response;
}

export async function getPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }

  // 使用搜索功能查询数据库中的页面
  const response = await notion.search({
    filter: {
      property: "object",
      value: "page",
    },
    sort: {
      direction: "descending",
      timestamp: "last_edited_time",
    },
  });

  // 过滤出属于该数据库的页面
  const databasePages = response.results.filter((item: any) => {
    return item.parent?.database_id === databaseId;
  });

  return databasePages;
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  // 使用Name属性匹配slug（暂时）
  // 如果数据库有Slug属性，可以改成: post.properties?.Slug?.rich_text?.[0]?.plain_text === slug
  return posts.find(
    (post: any) => {
      const name = post.properties?.Name?.title?.[0]?.plain_text || "";
      // 将标题转换为slug格式
      return name === slug;
    }
  );
}
