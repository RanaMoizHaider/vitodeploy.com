import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { VERSIONS, DEFAULT_VERSION, type Version } from "../lib/docs-config"

const CONTENT_DIR = path.join(process.cwd(), "content/docs")
const OUT_DIR = path.join(process.cwd(), "out/docs")

function copyMarkdownFiles() {
  let count = 0

  for (const version of VERSIONS) {
    const versionDir = path.join(CONTENT_DIR, version)
    if (!fs.existsSync(versionDir)) continue

    const targetDir =
      version === DEFAULT_VERSION ? OUT_DIR : path.join(OUT_DIR, version)

    function walk(dir: string, relativePath: string = "") {
      const entries = fs.readdirSync(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          walk(fullPath, path.join(relativePath, entry.name))
        } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
          const rawContent = fs.readFileSync(fullPath, "utf-8")
          const { content } = matter(rawContent)

          const mdName = entry.name.replace(/\.(mdx|md)$/, ".md")
          const outPath = path.join(targetDir, relativePath, mdName)

          fs.mkdirSync(path.dirname(outPath), { recursive: true })
          fs.writeFileSync(outPath, content.trim() + "\n")
          count++
        }
      }
    }

    walk(versionDir)
  }

  console.log(`Copied ${count} markdown files → out/docs/`)
}

copyMarkdownFiles()
