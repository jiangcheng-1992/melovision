import Link from "next/link";
import { stitchPages } from "@/lib/stitch-pages";

export default function InterfacesPage() {
  return (
    <main className="min-h-screen bg-[#14121f] px-6 py-12 text-[#e5e0f3]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#4cd7f6]">
            Stitch Pages
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            其余界面预览
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#e5e0f3]/65">
            这里按 `_stitch-source` 的原稿一页一页挂出了预览入口，优先保证和
            stitch 输出一致，后续再逐步原生化为 Next 组件。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {stitchPages.map((page) => (
            <Link
              key={page.slug}
              href={`/interfaces/${page.slug}`}
              className="rounded-3xl border border-[#4a4455]/40 bg-[#201e2c] p-6 transition hover:border-[#7c3aed]/70 hover:bg-[#2b2836]"
            >
              <div className="text-xs uppercase tracking-[0.24em] text-[#4cd7f6]">
                {page.sourceDir}
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                {page.title}
              </h2>
              <p className="mt-3 min-h-12 text-sm leading-7 text-[#e5e0f3]/60">
                {page.description}
              </p>
              <div className="mt-5 inline-flex rounded-full bg-[#7c3aed]/15 px-3 py-1 text-xs text-[#d2bbff]">
                /interfaces/{page.slug}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
