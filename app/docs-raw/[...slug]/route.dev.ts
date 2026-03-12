import { getDoc } from "@/lib/docs"
import { parseDocSlug } from "@/lib/docs-config"

// In production, .md files are served as static files written by scripts/copy-docs-md.ts.
// This route only runs in dev (output: "export" is not set in dev).
export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const { version, docSlug } = parseDocSlug(slug)
  const doc = getDoc(version, docSlug)

  if (!doc) return new Response("Not found", { status: 404 })

  return new Response(doc.content, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
