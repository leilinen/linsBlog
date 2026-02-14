import Link from "next/link";
import { getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";

// 结构化数据组件
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: `${post.title} | 林林多喝水`,
    description: post.content?.slice(0, 160) || "",
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  // 调试日志
  console.log(`\n=== PostPage Debug ===`);
  console.log(`Slug: "${resolvedParams.slug}"`);
  console.log(`Post found: ${!!post}`);
  console.log(`Post content length: ${post?.content?.length || 0}`);
  console.log(`Post summary: "${post?.summary || ""}"`);
  console.log(`Post content (first 200 chars): "${post?.content?.substring(0, 200) || ""}"`);

  if (!post) {
    notFound();
  }

  // JSON-LD 结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary || post.content?.slice(0, 160) || "",
    "image": post.coverImage || "https://blog.f-free.site/favicon.ico",
    "datePublished": post.date,
    "dateModified": post.updated || post.date,
    "author": {
      "@type": "Person",
      "name": "林林",
      "url": "https://blog.f-free.site",
    },
    "publisher": {
      "@type": "Organization",
      "name": "林林多喝水",
      "logo": {
        "@type": "ImageObject",
        "url": "https://blog.f-free.site/favicon.ico",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://blog.f-free.site/posts/${post.slug}`,
    },
    "keywords": post.tags?.join(", ") || "",
    "inLanguage": "zh-CN",
    ...(post.readingTime && { "timeRequired": `PT${post.readingTime}M` }),
  };

  return (
    <div className="min-h-[750px] bg-[#fafafa]">
      <JsonLd data={jsonLd} />
      {/* Header with navigation */}
      <div className="px-[1.75rem]">
        <div className="mx-auto max-w-[620px]">
          <div className="flex items-center justify-between py-[0.44rem]">
            <h1 className="font-merriweather-sans text-2xl font-light" style={{ color: "#1b8b62" }}>
              林林多喝水
            </h1>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[72px]" aria-hidden="true"></div>

      {/* Back button */}
      <div className="px-[1.75rem]">
        <div className="mx-auto max-w-[620px]">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[0.833rem] hover:opacity-70 transition-opacity"
            style={{ color: "#1b8b62" }}
          >
            <span>←</span>
            <span>返回</span>
          </Link>
        </div>
      </div>

      {/* Post content */}
      <article className="px-[1.75rem] mt-8">
        <div className="mx-auto max-w-[620px]">
          {/* 封面图 */}
          {post.coverImage && (
            <div className="mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto rounded"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-2xl font-medium leading-relaxed mb-3" style={{ color: "#1b8b62" }}>
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex items-center flex-wrap gap-3 mb-3">
              <time
                className="text-[0.833rem]"
                style={{ color: "#aeaeae" }}
                dateTime={post.date}
              >
                {post.dateDisplay}
              </time>

              {post.readingTime && (
                <span className="text-[0.75rem]" style={{ color: "#999" }}>
                  · {post.readingTime} 分钟阅读
                </span>
              )}
            </div>

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.75rem] px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "#f0f0f0",
                      color: "#666",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 摘要 */}
            {post.summary && (
              <p
                className="text-[0.875rem] italic"
                style={{
                  color: "#666",
                  lineHeight: "1.8",
                  borderLeft: "3px solid #1b8b62",
                  paddingLeft: "1rem",
                  marginTop: "1rem",
                  marginBottom: "2rem",
                }}
              >
                {post.summary}
              </p>
            )}
          </header>

          <div
            className="prose prose-sm max-w-none"
            style={{
              lineHeight: "1.8",
              color: "#333",
            }}
            dangerouslySetInnerHTML={{ __html: formatMarkdown(post.content || "") }}
          />
        </div>
      </article>

      {/* Footer */}
      <div className="px-[1.75rem] pt-[3.5rem] pb-[1.75rem]">
        <div className="mx-auto max-w-[620px]">
          <div className="text-[0.833rem]" style={{ color: "#1b8b62" }}>
            Copyright © 2026 leiline
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMarkdown(content: string): string {
  // Simple markdown parser for basic formatting
  return content
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-4 rounded my-4 overflow-x-auto"><code class="text-sm">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm" style="color: #1b8b62;">$1</code>')
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mt-8 mb-4" style="color: #1b8b62;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-medium mt-10 mb-6" style="color: #1b8b62;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-medium mt-12 mb-6" style="color: #1b8b62;">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded" />')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-6 my-2">$1</li>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 pl-4 my-4 italic" style="border-color: #1b8b62; color: #666;">$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gim, '<hr class="my-8 border-gray-300" />')
    // Paragraphs
    .replace(/\n\n/gim, '</p><p class="my-4">')
    .replace(/^(?!<)/gim, '<p class="my-4">')
    .replace(/<\/li><p class="my-4">/gim, '</li>')
    .replace(/(<li>.*<\/li>)/gim, '<ul class="my-4 ml-6 list-disc">$1</ul>')
    .replace(/<\/p><ul class="my-4 ml-6 list-disc">/gim, '<ul class="my-4 ml-6 list-disc">')
    .replace(/<\/ul><p class="my-4">/gim, '</ul>');
}
