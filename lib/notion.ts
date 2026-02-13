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

  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  return response.results;
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  return posts.find(
    (post: any) => post.properties.Slug?.rich_text?.[0]?.plain_text === slug
  );
}
