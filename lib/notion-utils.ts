export function notionBlockToMarkdown(block: any): string {
  const type = block.type;
  const content = block[type];

  switch (type) {
    case "paragraph":
      return paragraphToMarkdown(content);
    case "heading_1":
      return `# ${richTextToMarkdown(content.rich_text)}\n\n`;
    case "heading_2":
      return `## ${richTextToMarkdown(content.rich_text)}\n\n`;
    case "heading_3":
      return `### ${richTextToMarkdown(content.rich_text)}\n\n`;
    case "bulleted_list_item":
      return `- ${richTextToMarkdown(content.rich_text)}\n`;
    case "numbered_list_item":
      return `1. ${richTextToMarkdown(content.rich_text)}\n`;
    case "quote":
      return `> ${richTextToMarkdown(content.rich_text)}\n\n`;
    case "code":
      return `\`\`\`\n${content.rich_text?.[0]?.plain_text || ""}\n\`\`\`\n\n`;
    case "divider":
      return `---\n\n`;
    default:
      return "";
  }
}

function paragraphToMarkdown(content: any): string {
  const text = richTextToMarkdown(content.rich_text);
  return text ? `${text}\n\n` : "";
}

function richTextToMarkdown(richText: any[]): string {
  if (!richText || richText.length === 0) return "";

  return richText
    .map((text: any) => {
      let markdown = text.plain_text;

      // 处理加粗
      if (text.annotations.bold) {
        markdown = `**${markdown}**`;
      }

      // 处理斜体
      if (text.annotations.italic) {
        markdown = `*${markdown}*`;
      }

      // 处理删除线
      if (text.annotations.strikethrough) {
        markdown = `~~${markdown}~~`;
      }

      // 处理代码
      if (text.annotations.code) {
        markdown = `\`${markdown}\```;
      }

      // 处理链接
      if (text.href) {
        markdown = `[${markdown}](${text.href})`;
      }

      return markdown;
    })
    .join("");
}

export async function getPageBlocks(pageId: string) {
  const { Client } = await import("@notionhq/client");
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

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

  return blocks;
}

export async function getPageContent(pageId: string): Promise<string> {
  const blocks = await getPageBlocks(pageId);

  return blocks
    .map((block: any) => notionBlockToMarkdown(block))
    .join("");
}
