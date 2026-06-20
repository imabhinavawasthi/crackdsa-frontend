import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content/learn/dsa");

import type {
  SidebarItem,
  SidebarSection,
  SidebarCategory,
  ArticleContent
} from "@/types/content";
export type {
  SidebarItem,
  SidebarSection,
  SidebarCategory,
  ArticleContent
} from "@/types/content";

type RawSyllabusItem = string | {
  slug: string;
  title?: string;
};

interface RawSyllabusSection {
  title: string;
  items: RawSyllabusItem[];
}

interface RawSyllabusCategory {
  id: string;
  title: string;
  description?: string;
  sections?: RawSyllabusSection[];
}

// Custom simple YAML/Frontmatter and MDX tag parser
function parseMdxFile(filePath: string, slug: string): ArticleContent {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  
  // 1. Parse Frontmatter
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = fileContent.match(frontmatterRegex);
  
  const metadata: Record<string, string | string[]> = {};
  let body = fileContent;

  if (match) {
    body = fileContent.replace(frontmatterRegex, "").trim();
    const yamlBlock = match[1];
    const lines = yamlBlock.split("\n");
    
    let currentKey = "";
    let listAccumulator: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith("-")) {
        const val = trimmed.substring(1).trim().replace(/^"|"$/g, "");
        listAccumulator.push(val);
        if (currentKey) {
          metadata[currentKey] = [...listAccumulator];
        }
      } else {
        listAccumulator = [];
        const colonIdx = trimmed.indexOf(":");
        if (colonIdx !== -1) {
          const key = trimmed.substring(0, colonIdx).trim();
          const val = trimmed.substring(colonIdx + 1).trim().replace(/^"|"$/g, "");
          metadata[key] = val;
          currentKey = key;
        }
      }
    });
  }

  // Helper to extract clean content from block tags
  const extractTagContent = (tagName: string, source: string): string => {
    const regex = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`);
    const tagMatch = source.match(regex);
    return tagMatch ? tagMatch[1].trim() : "";
  };

  // Helper to extract bullet items from a block
  const extractBulletItems = (source: string): string[] => {
    const lines = source.split("\n");
    return lines
      .map(line => line.trim())
      .filter(line => line.startsWith("-"))
      .map(line => line.substring(1).trim().replace(/^"|"$/g, ""));
  };

  // 2. Parse Custom MDX Tag Mappings
  
  // Extract CodeBlock
  let codeExamples: ArticleContent["codeExamples"] = undefined;
  const codeBlockRegex = /<CodeBlock\s+cpp=\{`([\s\S]*?)`\}\s+java=\{`([\s\S]*?)`\}\s+python=\{`([\s\S]*?)`\}\s*\/>/;
  const codeMatch = body.match(codeBlockRegex);
  if (codeMatch) {
    codeExamples = {
      cpp: codeMatch[1].trim(),
      java: codeMatch[2].trim(),
      python: codeMatch[3].trim()
    };
  }

  // Extract ComplexityTable
  let complexity: ArticleContent["complexity"] = undefined;
  const compTableRegex = /<ComplexityTable\s+best="([^"]+)"\s+average="([^"]+)"\s+worst="([^"]+)"\s+space="([^"]+)"\s+description="([^"]*)"\s*\/>/;
  const compMatch = body.match(compTableRegex);
  if (compMatch) {
    complexity = {
      best: compMatch[1],
      average: compMatch[2],
      worst: compMatch[3],
      space: compMatch[4],
      description: compMatch[5]
    };
  }

  // Extract Warning List
  const warningBlock = extractTagContent("Warning", body);
  const commonMistakes = warningBlock ? extractBulletItems(warningBlock) : [];

  // Extract InterviewTips
  let interviewTips: string[] = [];
  const interviewTipsRegex = /<InterviewTips\s+tips=\{([\s\S]*?)\}\s*\/>/;
  const interviewMatch = body.match(interviewTipsRegex);
  if (interviewMatch) {
    try {
      interviewTips = JSON.parse(interviewMatch[1].trim());
    } catch {
      // Fallback simple bullet parser
      interviewTips = extractBulletItems(interviewMatch[1]);
    }
  }

  // Extract PracticeProblems
  let practiceProblems: ArticleContent["practiceProblems"] = [];
  const problemsRegex = /<PracticeProblems\s+problems=\{([\s\S]*?)\}\s*\/>/;
  const problemsMatch = body.match(problemsRegex);
  if (problemsMatch) {
    try {
      practiceProblems = JSON.parse(problemsMatch[1].trim());
    } catch (e) {
      console.error("Failed to parse problems JSON:", e);
    }
  }

  // Extract Theory, Visualization, and Examples by parsing markdown sections
  let theory = "";
  const theoryHeaderIdx = body.indexOf("# Theory & Concepts");
  const vizHeaderIdx = body.indexOf("# Visual Representation");
  const codeHeaderIdx = body.indexOf("# Code Implementation");

  if (theoryHeaderIdx !== -1) {
    const endIdx = vizHeaderIdx !== -1 ? vizHeaderIdx : (codeHeaderIdx !== -1 ? codeHeaderIdx : body.length);
    theory = body.substring(theoryHeaderIdx + 19, endIdx).trim();
  }

  let visualization = "";
  if (vizHeaderIdx !== -1) {
    const endIdx = codeHeaderIdx !== -1 ? codeHeaderIdx : body.length;
    const rawViz = body.substring(vizHeaderIdx + 23, endIdx).trim();
    // Strip fenced code blocks
    visualization = rawViz.replace(/^```[a-zA-Z]*\n|```$/g, "").trim();
  }

  const getMetadataString = (key: string, fallback: string) => {
    const value = metadata[key];
    return typeof value === "string" ? value : fallback;
  };

  const getMetadataList = (key: string) => {
    const value = metadata[key];
    return Array.isArray(value) ? value : [];
  };

  return {
    slug,
    title: getMetadataString("title", "Untitled Article"),
    category: getMetadataString("category", "General"),
    readTime: getMetadataString("readTime", "5 min read"),
    lastUpdated: getMetadataString("lastUpdated", "May 30, 2026"),
    whatYouWillLearn: getMetadataList("whatYouWillLearn"),
    theory: theory || body,
    visualization: visualization || undefined,
    codeExamples,
    complexity,
    commonMistakes,
    interviewTips,
    practiceProblems,
    summary: getMetadataString("summary", ""),
    content: body,
    toc: []
  };
}

// 3. Syllabus/Docs-Tree Crawler
export function getDsaSyllabus(): SidebarCategory[] {
  const syllabusPath = path.join(CONTENT_DIR, "syllabus.json");
  if (!fs.existsSync(syllabusPath)) {
    return [];
  }

  try {
    const syllabusData = JSON.parse(fs.readFileSync(syllabusPath, "utf-8")) as {
      categories?: RawSyllabusCategory[];
    };
    const categories: SidebarCategory[] = [];

    syllabusData.categories?.forEach((cat) => {
      const categoryPath = path.join(CONTENT_DIR, cat.id);

      // Collect all flat items & section mappings
      const flatItems: SidebarItem[] = [];
      const sections: SidebarSection[] = [];

      if (cat.sections) {
        cat.sections.forEach((sec) => {
          const secItems: SidebarItem[] = [];
          sec.items.forEach((item) => {
            const itemObj = typeof item === "string" ? { slug: item, title: item.replace(/-/g, " ") } : item;
            const filePath = path.join(categoryPath, `${itemObj.slug}.mdx`);
            
            // Extract latest title from the actual MDX file if it exists, otherwise fall back to specified title
            let title = itemObj.title || itemObj.slug.replace(/-/g, " ");
            if (fs.existsSync(filePath)) {
              try {
                const content = fs.readFileSync(filePath, "utf-8");
                const titleMatch = content.match(/title:\s*"([^"]+)"/) || content.match(/title:\s*([^\n]+)/);
                if (titleMatch) {
                  title = titleMatch[1].trim().replace(/^"|"$/g, "");
                }
              } catch (e) {
                console.error(`Failed to read title from file:`, e);
              }
            }

            const sidebarItem = {
              slug: itemObj.slug,
              title
            };

            secItems.push(sidebarItem);
            flatItems.push(sidebarItem);
          });

          sections.push({
            title: sec.title,
            items: secItems
          });
        });
      }

      categories.push({
        id: cat.id,
        title: cat.title,
        description: cat.description,
        items: flatItems,
        sections: sections.length > 0 ? sections : undefined
      });
    });

    return categories;
  } catch (e) {
    console.error("Failed to parse centralized syllabus.json:", e);
    return [];
  }
}

// 4. Load Single Article Details
export function getDsaArticle(slug: string): ArticleContent | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    return parseMdxFile(filePath, slug);
  } catch (e) {
    console.error(`Failed to load article ${slug}:`, e);
    return null;
  }
}
