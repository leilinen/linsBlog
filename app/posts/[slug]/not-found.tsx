import Link from "next/link";

export default function NotFound() {
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

      {/* Spacer */}
      <div className="h-[72px]" aria-hidden="true"></div>

      {/* 404 content */}
      <div className="px-[1.75rem]">
        <div className="mx-auto max-w-[620px] text-center">
          <h1 className="text-4xl font-light mb-4" style={{ color: "#1b8b62" }}>
            404
          </h1>
          <p className="text-lg mb-8" style={{ color: "#666" }}>
            文章不存在
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2 text-[0.833rem] hover:opacity-70 transition-opacity"
            style={{
              backgroundColor: "#1b8b62",
              color: "#fff",
              borderRadius: "20px",
            }}
          >
            <span>←</span>
            <span>返回首页</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
