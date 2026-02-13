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
    case "to_do":
      return `${content.checked ? "- [x]" : "- [ ]"} ${richTextToMarkdown(content.rich_text)}\n`;
    case "toggle":
      return `<details>\n<summary>${richTextToMarkdown(content.rich_text)}</summary>\n\n</details>\n\n`;
    case "quote":
      return `> ${richTextToMarkdown(content.rich_text)}\n\n`;
    case "callout":
      return `> ${content.icon?.emoji || ""} ${richTextToMarkdown(content.rich_text)}\n\n`;
    case "code":
      const language = content.language || "";
      return `\`\`\`${language}\n${content.rich_text?.[0]?.plain_text || ""}\n\`\`\`\n\n`;
    case "divider":
      return `---\n\n`;
    case "image":
      const imageUrl = content.file?.url || content.external?.url;
      const caption = content.caption?.[0]?.plain_text || "";
      return imageUrl ? `
![${caption}](${imageUrl})
${caption ? `\n*${caption}*\n\n` : "\n\n"}` : "";
    case "video":
      const videoUrl = content.file?.url || content.external?.url;
      return videoUrl ? `
[Video: ${videoUrl}](${videoUrl})

` : "";
    case "file":
      const fileUrl = content.file?.url || content.external?.url;
      const fileName = content.name || "File";
      return fileUrl ? `
📎 [${fileName}](${fileUrl})

` : "";
    case "pdf":
      const pdfUrl = content.file?.url || content.external?.url;
      return pdfUrl ? `
📄 [PDF](${pdfUrl})

` : "";
    case "bookmark":
      const bookmarkUrl = content.url;
      const bookmarkTitle = content.caption?.[0]?.plain_text || bookmarkUrl;
      return bookmarkUrl ? `
[${bookmarkTitle}](${bookmarkUrl})

` : "";
    case "embed":
      const embedUrl = content.url;
      return embedUrl ? `
[Embed: ${embedUrl}](${embedUrl})

` : "";
    case "table":
      return tableToMarkdown(block);
    case "table_row":
      return tableRowToMarkdown(block);
    case "column_list":
      return content.column_list?.children?.map((child: any) => notionBlockToMarkdown(child)).join("\n") || "";
    case "column":
      return content.children?.map((child: any) => notionBlockToMarkdown(child)).join("\n") || "";
    default:
      console.log(`Unsupported block type: ${type}`);
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
        markdown = `\`${markdown}\``;
      }

      // 处理下划线
      if (text.annotations.underline) {
        markdown = `<u>${markdown}</u>`;
      }

      // 处理高亮
      if (text.annotations.color && text.annotations.color !== "default") {
        markdown = `<span style="color: ${text.annotations.color}">${markdown}</span>`;
      }

      // 处理链接
      if (text.href) {
        markdown = `[${markdown}](${text.href})`;
      }

      // 处理公式（LaTeX）
      if (text.type === "equation") {
        markdown = `$$${markdown}$$`;
      }

      return markdown;
    })
    .join("");
}

function tableToMarkdown(block: any): string {
  const children = block.table?.children || [];
  if (children.length === 0) return "";

  const rows = children.map((child: any) => tableRowToMarkdown(child)).join("\n");
  const header = children[0];
  const separator = "|".repeat(header.table_row?.cells?.length + 1);

  return `
|${separator}
${rows}
`;
}

function tableRowToMarkdown(block: any): string {
  const cells = block.table_row?.cells || [];
  const cellText = cells.map((cell: any[]) => richTextToMarkdown(cell)).join(" | ");
  return `| ${cellText} |`;
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

// 获取页面属性
export async function getPageProperty(pageId: string, propertyId: string) {
  const { Client } = await import("@notionhq/client");
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const response = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: propertyId,
  });

  return response;
}
