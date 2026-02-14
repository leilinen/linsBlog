import Link from "next/link";

export const metadata = {
  title: "关于 | 林林多喝水",
  description: "Designer & Storyteller",
};

export default function AboutPage() {
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

      {/* Content */}
      <article className="px-[1.75rem] mt-8">
        <div className="mx-auto max-w-[620px]">
          <header className="mb-8">
            <h1 className="text-2xl font-medium leading-relaxed" style={{ color: "#1b8b62" }}>
              关于
            </h1>
          </header>

          <div
            className="prose prose-sm max-w-none"
            style={{
              lineHeight: "1.8",
              color: "#333",
            }}
          >
            <p className="my-4">
              这里是关于页面。
            </p>
            <p className="my-4">
              Designer & Storyteller。
            </p>
          </div>
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
