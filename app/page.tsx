"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { posts, Post } from "@/lib/posts";

export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();

  const menuItems = [
    { name: "关于", href: "/about" },
    { name: "技艺", href: "/skills" },
    { name: "生活", href: "/life" },
    { name: "乱翻书", href: "/books" },
    { name: "看天下", href: "/world" },
    { name: "图展", href: "/gallery" },
  ];

  useEffect(() => {
    const pageParam = searchParams.get("page");
    setPage(pageParam ? parseInt(pageParam) : 1);
  }, [searchParams]);

  const POSTS_PER_PAGE = 7;
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPage = page;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="min-h-[750px] bg-[#fafafa]">
      {/* Header with navigation */}
      <div className="px-[1.75rem]">
        <div className="mx-auto max-w-[620px]">
          <div className="flex items-center justify-between py-[0.44rem]">
            <h1 className="font-merriweather-sans text-2xl font-light" style={{ color: "#1b8b62" }}>
              林林多喝水
            </h1>

            {/* Hamburger menu with dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              {/* Hamburger button */}
              <button
                className="flex flex-col justify-center items-center cursor-pointer"
                style={{ border: "none", background: "none", padding: "4px", width: "24px", height: "24px" }}
              >
                <span style={{ display: "block", width: "18px", height: "1.5px", backgroundColor: "#1b8b62", marginBottom: "4px" }}></span>
                <span style={{ display: "block", width: "18px", height: "1.5px", backgroundColor: "#1b8b62", marginBottom: "4px" }}></span>
                <span style={{ display: "block", width: "18px", height: "1.5px", backgroundColor: "#1b8b62" }}></span>
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <div
                  className="absolute right-0 mt-1 py-1 rounded shadow-sm z-50"
                  style={{
                    backgroundColor: "#fafafa",
                    minWidth: "100px",
                    fontSize: "0.75rem",
                    opacity: 0,
                    transform: "translateY(-10px)",
                    animation: "slideDown 1s ease-out forwards",
                  }}
                >
                  <style>{`
                    @keyframes slideDown {
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2.5 hover:bg-gray-100 hover:underline no-underline"
                      style={{ color: "#1b8b62" }}
                      onClick={() => setShowDropdown(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[72px]" aria-hidden="true"></div>

      {/* Posts list */}
      <div className="px-[1.75rem]">
        <div className="mx-auto max-w-[620px]">
          <ul className="m-0 list-none p-0">
            {currentPosts.map((post) => (
              <li key={post.id} className="my-0">
                <article className="flex items-center justify-between gap-4 text-[0.833rem]">
                  <h2
                    className="font-medium leading-relaxed"
                    style={{ fontWeight: 400, lineHeight: "1.65", fontFamily: "var(--font-open-sans), system-ui, sans-serif" }}
                  >
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <time
                    className="whitespace-nowrap text-[0.833rem]"
                    style={{ color: "#aeaeae", fontWeight: 200, lineHeight: "1.3" }}
                    dateTime={post.date}
                  >
                    {post.dateDisplay}
                  </time>
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
          <div className="flex items-start justify-between gap-12">
            <div className="text-[0.833rem]" style={{ color: "#1b8b62", flexBasis: "45%" }}>
              Designer & Storyteller
            </div>
            <div style={{ flexBasis: "55%" }}>
              <form action="/search">
                <input
                  type="search"
                  name="q"
                  placeholder="输入搜索关键字/词..."
                  className="w-full rounded-full px-4 py-2 text-[0.833rem] bg-[#e9e9e9] placeholder-gray-400 focus:outline-none"
                  style={{ fontSize: "0.66rem", borderRadius: "18px" }}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
