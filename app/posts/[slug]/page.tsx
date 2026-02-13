import Link from "next/link";
import { getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

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
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-[750px] bg-[#fafafa]">
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
          <header className="mb-8">
            <h1 className="text-2xl font-medium leading-relaxed" style={{ color: "#1b8b62" }}>
              {post.title}
            </h1>
            <time
              className="text-[0.833rem] mt-2 block"
              style={{ color: "#aeaeae" }}
              dateTime={post.date}
            >
              {post.dateDisplay}
            </time>
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
          <div className="flex items-start justify-between gap-12">
            <div className="text-[0.833rem]" style={{ color: "#1b8b62", flexBasis: "45%" }}>
              Designer & Storyteller
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMarkdown(content: string): string {
  // Simple markdown parser for basic formatting
  return content
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mt-6 mb-3" style="color: #1b8b62;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-medium mt-8 mb-4" style="color: #1b8b62;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-medium mt-8 mb-4" style="color: #1b8b62;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 my-2">$1</li>')
    .replace(/\n\n/gim, '</p><p class="my-4">')
    .replace(/^(?!<)/gim, '<p class="my-4">')
    .replace(/<\/li><p class="my-4">/gim, '</li>')
    .replace(/(<li>.*<\/li>)/gim, '<ul class="my-4">$1</ul>')
    .replace(/<\/p><ul class="my-4">/gim, '<ul class="my-4">')
    .replace(/<\/ul><p class="my-4">/gim, '</ul>');
}
