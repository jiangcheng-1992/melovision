import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stitchPageMap, stitchPreviewPages } from "@/lib/stitch-pages";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return stitchPreviewPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = stitchPageMap.get(slug);

  if (!page) {
    return {
      title: "Interface Not Found",
    };
  }

  return {
    title: `${page.title} - MeloVision`,
    description: page.description,
  };
}

export default async function StitchInterfacePage({ params }: PageProps) {
  const { slug } = await params;
  const page = stitchPageMap.get(slug);

  if (!page) {
    notFound();
  }

  const htmlPath = path.join(
    process.cwd(),
    "_stitch-source",
    page.sourceDir,
    "code.html",
  );

  const sourceHtml = await fs.readFile(htmlPath, "utf8");
  const srcDoc = sourceHtml.replace(
    "<head>",
    `<head><base href="/" /><style>html,body{margin:0;padding:0;}</style>`,
  );

  return (
    <main className="min-h-screen bg-[#0e0c19] text-[#e5e0f3]">
      <iframe
        srcDoc={srcDoc}
        title={page.title}
        className="mx-auto block w-full max-w-[1728px] border-0 bg-[#14121f]"
        style={{ height: `${page.frameHeight}px` }}
      />
    </main>
  );
}
