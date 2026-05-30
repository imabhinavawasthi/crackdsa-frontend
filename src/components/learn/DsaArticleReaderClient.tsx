"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Calendar, 
  Clock, 
  ChevronLeft,
  XCircle,
  Share2,
  Check
} from "lucide-react";
import DsaDocsTOC, { TOCHeading } from "@/components/learn/DsaDocsTOC";
import { 
  Note, 
  Warning, 
  Tip, 
  Info, 
  CodeBlock, 
  ComplexityTable, 
  PracticeProblems, 
  InterviewTips, 
  PreviousArticle, 
  NextArticle,
  CustomMarkdown
} from "@/components/learn/MdxComponents";
import { ArticleContent } from "@/utils/mdxLoader";

interface DsaArticleReaderClientProps {
  article: ArticleContent;
  slug: string;
  previousItem: { slug: string; title: string } | null;
  nextItem: { slug: string; title: string } | null;
}

export default function DsaArticleReaderClient({
  article,
  slug,
  previousItem,
  nextItem,
}: DsaArticleReaderClientProps) {
  // State to track scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Scroll listener to update reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Table of Contents headings mapping based on loaded MDX fields
  const tocHeadings: TOCHeading[] = [
    { id: "what-you-will-learn", text: "What You Will Learn", level: 2 },
    { id: "theory", text: "Theory & Concepts", level: 2 },
    ...(article.visualization ? [{ id: "visualization", text: "Visual Representation", level: 2 }] : []),
    ...(article.codeExamples ? [{ id: "code-examples", text: "Code Implementation", level: 2 }] : []),
    ...(article.complexity ? [{ id: "complexity-analysis", text: "Complexity Analysis", level: 2 }] : []),
    ...(article.commonMistakes && article.commonMistakes.length > 0 ? [{ id: "common-mistakes", text: "Common Pitfalls", level: 2 }] : []),
    ...(article.interviewTips && article.interviewTips.length > 0 ? [{ id: "interview-questions", text: "Interview Intelligence", level: 2 }] : []),
    ...(article.practiceProblems && article.practiceProblems.length > 0 ? [{ id: "practice-problems", text: "Practice Challenges", level: 2 }] : []),
    ...(article.summary ? [{ id: "summary", text: "Summary Recap", level: 2 }] : [])
  ];

  return (
    <div className="w-full flex relative">
      
      {/* Dynamic Reading Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-150 dark:bg-gray-800 z-50">
        <div 
          className="bg-brand-500 h-full transition-all duration-75 ease-out shadow-sm"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Focus Content Container */}
      <div className="flex-1 max-w-3xl mx-auto px-5 sm:px-7 md:px-9 py-8 space-y-8 min-w-0">
        
        {/* 1. Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none select-none">
          <Link href="/learn" className="hover:text-brand-500 transition-colors">Learn</Link>
          <span className="text-gray-300 dark:text-gray-800">/</span>
          <Link href="/learn/dsa" className="hover:text-brand-500 transition-colors">DSA</Link>
          <span className="text-gray-300 dark:text-gray-800">/</span>
          <span className="truncate max-w-[120px] text-gray-500 dark:text-gray-400">{article.category}</span>
        </nav>

        {/* 2. Article Header Title Block */}
        <div className="space-y-3.5 border-b border-gray-100 dark:border-gray-855 pb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-widest bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10 w-fit select-none leading-none">
            <span>Module: {article.category}</span>
          </div>

          <h1 className="text-2.5xl sm:text-3.5xl font-black tracking-tight leading-tight text-gray-900 dark:text-white select-none">
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-2.5 pt-0.5">
            <div className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 px-2 py-1 rounded-md select-none uppercase tracking-wider">
              <Clock size={10} className="text-gray-400" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 px-2 py-1 rounded-md select-none uppercase tracking-wider">
              <Calendar size={10} className="text-gray-400" />
              <span>Updated {article.lastUpdated}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/15 border border-brand-500/15 hover:border-brand-500/30 px-2.5 py-1 rounded-md select-none uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 active:bg-brand-500/20 w-fit"
              title="Copy article URL link to share"
            >
              {copied ? <Check size={10} className="text-emerald-500 dark:text-emerald-400 stroke-[3]" /> : <Share2 size={10} className="stroke-[2.5]" />}
              <span>{copied ? "Copied!" : "Share Link"}</span>
            </button>
          </div>
        </div>

        {/* 3. Reading-Optimized Body content in template sections */}
        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal space-y-8">
          
          {/* Section: What You Will Learn */}
          {article.whatYouWillLearn && article.whatYouWillLearn.length > 0 && (
            <section id="what-you-will-learn" className="space-y-3 pt-2">
              <h2 className="text-sm font-bold text-gray-905 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                What You Will Learn
              </h2>
              <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/20 border border-gray-150 dark:border-gray-800/80 grid grid-cols-1 gap-2.5">
                {article.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="h-4 w-4 shrink-0 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center text-[10px] font-extrabold mt-0.5">✓</span>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Theory */}
          <section id="theory" className="space-y-4 pt-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
              Theory & Concepts
            </h2>
            <CustomMarkdown text={article.theory} />
          </section>

          {/* Section: Visualization (optional) */}
          {article.visualization && (
            <section id="visualization" className="space-y-3 pt-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                Visual Representation
              </h2>
              <pre className="p-5 overflow-x-auto text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800/60 rounded-2xl custom-scrollbar leading-relaxed">
                <code>{article.visualization}</code>
              </pre>
            </section>
          )}

          {/* Section: Code Examples (optional) */}
          {article.codeExamples && (
            <section id="code-examples" className="space-y-3 pt-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                Code Implementation
              </h2>
              
              <Tip>
                We provide optimized C++, Java, and Python templates. Toggle tabs inside the code block to copy and test implementations.
              </Tip>

              <CodeBlock 
                cpp={article.codeExamples.cpp}
                java={article.codeExamples.java}
                python={article.codeExamples.python}
              />
            </section>
          )}

          {/* Section: Complexity Analysis (optional) */}
          {article.complexity && (
            <section id="complexity-analysis" className="space-y-3 pt-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                Complexity Analysis
              </h2>
              
              <ComplexityTable 
                best={article.complexity.best}
                average={article.complexity.average}
                worst={article.complexity.worst}
                space={article.complexity.space}
                description={article.complexity.description}
              />
            </section>
          )}

          {/* Section: Common Mistakes */}
          {article.commonMistakes && article.commonMistakes.length > 0 && (
            <section id="common-mistakes" className="space-y-3.5 pt-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                Common Pitfalls
              </h2>
              <Warning>
                <ul className="list-disc list-inside space-y-2 marker:text-amber-500 text-sm font-semibold">
                  {article.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="leading-relaxed">{mistake}</li>
                  ))}
                </ul>
              </Warning>
            </section>
          )}

          {/* Section: Interview Questions */}
          {article.interviewTips && article.interviewTips.length > 0 && (
            <section id="interview-questions" className="space-y-3 pt-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                Interview Intelligence
              </h2>
              <InterviewTips tips={article.interviewTips} />
            </section>
          )}

          {/* Section: Practice Problems */}
          {article.practiceProblems && article.practiceProblems.length > 0 && (
            <section id="practice-problems" className="space-y-3 pt-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                Practice Challenges
              </h2>
              <PracticeProblems problems={article.practiceProblems} />
            </section>
          )}

          {/* Section: Summary */}
          {article.summary && (
            <section id="summary" className="space-y-3 pt-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                Summary Recap
              </h2>
              <div className="p-5 rounded-2xl bg-gray-50/20 dark:bg-gray-900/10 border border-gray-150 dark:border-gray-800/80 text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed italic">
                {article.summary}
              </div>
            </section>
          )}

        </div>

        {/* 4. Previous / Next Nav Cards */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100 dark:border-gray-800/80">
          {previousItem && (
            <PreviousArticle 
              slug={`/learn/dsa/${previousItem.slug}`}
              title={previousItem.title}
            />
          )}
          {nextItem && (
            <NextArticle 
              slug={`/learn/dsa/${nextItem.slug}`}
              title={nextItem.title}
            />
          )}
        </div>

      </div>

      {/* Right Sidebar Table of Contents Navigation */}
      <DsaDocsTOC headings={tocHeadings} />

    </div>
  );
}
