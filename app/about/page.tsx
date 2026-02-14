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
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 className="font-merriweather-sans text-2xl font-light hover:opacity-70 transition-opacity cursor-pointer" style={{ color: "#1b8b62" }}>
                林林多喝水
              </h1>
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[72px]" aria-hidden="true"></div>

      {/* Content */}
      <article className="px-[1.75rem] mt-8">
        <div className="mx-auto max-w-[620px]">
          <header className="mb-8">
            <h2 className="text-2xl font-medium leading-relaxed" style={{ color: "#1b8b62" }}>
              关于我
            </h2>
          </header>

          <div
            className="prose prose-sm max-w-none"
            style={{
              lineHeight: "1.8",
              color: "#333",
            }}
          >
            <p className="my-4">
              一个工程师，会在这里记录所思，所想，所行。
              公众号"林林多喝水"。
            </p>

            <img
              src="https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/9b9461ca-042a-410c-97cf-9a6250de53fd/934cc0c62144aa9d95df4d2c15e820c4.jpg?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1771050854&Signature=hy9VJivLbDefZykw1CuD6rj2C6s="
              alt="关于我"
              className="w-full h-auto rounded my-8"
              style={{ maxHeight: "200px", objectFit: "contain" }}
            />
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
