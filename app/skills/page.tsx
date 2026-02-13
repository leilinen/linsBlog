import Link from "next/link";

export const metadata = {
  title: "技艺 | 林林多喝水",
  description: "技艺相关内容",
};

export default function SkillsPage() {
  return (
    <div className="min-h-[750px] bg-[#fafafa]">
      {/* Header */}
      <div className="px-[1.75rem]">
        <div className="mx-auto max-w-[620px]">
          <div className="flex items-center justify-between py-[0.44rem]">
            <h1 className="font-merriweather-sans text-2xl font-light" style={{ color: "#1b8b62" }}>
              林林多喝水
            </h1>
          </div>
        </div>
      </div>

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

      <article className="px-[1.75rem] mt-8">
        <div className="mx-auto max-w-[620px]">
          <header className="mb-8">
            <h1 className="text-2xl font-medium leading-relaxed" style={{ color: "#1b8b62" }}>
              技艺
            </h1>
          </header>

          <div style={{ lineHeight: "1.8", color: "#333" }}>
            <p className="my-4">这里展示技艺相关的内容...</p>
          </div>
        </div>
      </article>

      {/* Footer */}
      <div className="px-[1.75rem] pt-[3.5rem] pb-[1.75rem]">
        <div className="mx-auto max-w-[620px]">
          <div className="text-[0.833rem]" style={{ color: "#1b8b62", flexBasis: "45%" }}>
            Designer & Storyteller
          </div>
        </div>
      </div>
    </div>
  );
}
