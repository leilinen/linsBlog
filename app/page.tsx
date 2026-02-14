import Link from "next/link";
import { getPaginatedPosts } from "@/lib/posts";
import { getAllPosts } from "@/lib/posts";

// 结构化数据组件
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const { posts: currentPosts, currentPage, totalPages, hasNextPage, hasPrevPage } = await getPaginatedPosts(page);
  const allPosts = await getAllPosts();

  // JSON-LD 结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "林林多喝水",
    "url": "https://blog.f-free.site",
    "description": "Designer & Storyteller - 一个关于设计、生活、技艺和阅读的个人博客",
    "author": {
      "@type": "Person",
      "name": "林林",
    },
    "publisher": {
      "@type": "Organization",
      "name": "林林多喝水",
      "logo": {
        "@type": "ImageObject",
        "url": "https://blog.f-free.site/favicon.ico",
      },
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://blog.f-free.site/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    "inLanguage": "zh-CN",
    "copyrightYear": new Date().getFullYear(),
  };

  const menuItems = [
    { name: "关于", href: "/about" },
    { name: "技艺", href: "/skills" },
    { name: "生活", href: "/life" },
    { name: "乱翻书", href: "/books" },
    { name: "看天下", href: "/world" },
    { name: "图展", href: "/gallery" },
  ];

  return (
    <div className="min-h-[750px] bg-[#fafafa]">
      <JsonLd data={jsonLd} />
      {/* Header with navigation */}
      <div className="px-[1.75rem]">
        <div className="mx-auto max-w-[620px]">
          <div className="flex items-center justify-between py-[0.44rem]">
            <h1 className="font-merriweather-sans text-sm font-light" style={{ color: "#1b8b62" }}>
              林林多喝水
            </h1>

            {/* Hamburger menu with dropdown */}
            <div
              className="relative group"
            >
              {/* Hamburger button */}
              <button
                className="flex flex-col justify-center items-center cursor-pointer"
                style={{ border: "none", background: "none", padding: "5px", width: "28px", height: "28px" }}
              >
                <span style={{ display: "block", width: "18px", height: "1.5px", backgroundColor: "#1b8b62", marginBottom: "4px" }}></span>
                <span style={{ display: "block", width: "18px", height: "1.5px", backgroundColor: "#1b8b62", marginBottom: "4px" }}></span>
                <span style={{ display: "block", width: "18px", height: "1.5px", backgroundColor: "#1b8b62" }}></span>
              </button>

              {/* Dropdown menu */}
              <div
                className="absolute right-0 mt-1 py-1 rounded shadow-sm z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-1000"
                style={{
                  backgroundColor: "#fafafa",
                  minWidth: "100px",
                  fontSize: "1rem",
                  transform: "translateY(-10px)",
                  transition: "all 1s ease-out",
                }}
              >
                <style>{`
                  .group-hover > div:nth-child(2) {
                    opacity: 1;
                    transform: translateY(0);
                  }
                `}</style>
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 hover:bg-gray-100 hover:underline"
                    style={{ color: "#1b8b62" }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[72px]" aria-hidden="true"></div>

      {/* Posts list */}
      <div className="px-[1.75rem]">
        <div className="mx-auto max-w-[620px]">
          <ul className="m-0 list-none p-0" style={{ paddingLeft: 0, marginLeft: 0 }}>
            {currentPosts.map((post) => (
              <li key={post.id} className="mb-6 pb-6" style={{ borderBottom: "1px solid #e5e5e5" }}>
                <article>
                  {/* 封面图 */}
                  {post.coverImage && (
                    <Link href={`/posts/${post.slug}`} className="block mb-3">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-auto rounded"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                    </Link>
                  )}

                  {/* 标题和日期 */}
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h2
                      className="font-medium leading-relaxed text-[1.1rem]"
                      style={{ fontWeight: 400, lineHeight: "1.65", fontFamily: "var(--font-open-sans), system-ui, sans-serif" }}
                    >
                      <Link
                        href={`/posts/${post.slug}`}
                        className="post-title-link"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <time
                      className="whitespace-nowrap text-[0.75rem] shrink-0"
                      style={{ color: "#aeaeae", fontWeight: 200, lineHeight: "1.3" }}
                      dateTime={post.date}
                    >
                      {post.dateDisplay}
                    </time>
                  </div>

                  {/* 摘要 */}
                  {post.summary && (
                    <p className="text-[0.833rem] mb-2" style={{ color: "#666", lineHeight: "1.6" }}>
                      {post.summary}
                    </p>
                  )}

                  {/* 标签 */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[0.7rem] px-2 py-0.5 rounded-full"
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

                  {/* 阅读时间 */}
                  {post.readingTime && (
                    <span className="text-[0.7rem] ml-2" style={{ color: "#999" }}>
                      {post.readingTime} 分钟阅读
                    </span>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pagination */}
      <nav className="px-[1.75rem] mt-[1.75rem]" style={{ color: "#1b8b62" }} aria-label="分页">
        <div className="mx-auto max-w-[620px]">
          <div className="flex items-center justify-between text-[0.833rem]">
            {hasPrevPage && (
              <Link
                href={`?page=${currentPage - 1}`}
                className="hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                <span>←</span>
                <span>上一页</span>
              </Link>
            )}

            {/* Page numbers - only show if more than 1 page */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`?page=${pageNum}`}
                    className={`px-[0.5rem] py-[0.25rem] hover:opacity-70 transition-opacity ${
                      pageNum === currentPage ? "opacity-100" : "opacity-70"
                    }`}
                    style={{
                      color: pageNum === currentPage ? "#1b8b62" : "#1b8b62",
                      fontWeight: pageNum === currentPage ? 400 : 200,
                    }}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>
            )}

            {hasNextPage && (
              <Link
                href={`?page=${currentPage + 1}`}
                className="hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                <span>下一页</span>
                <span>→</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

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
