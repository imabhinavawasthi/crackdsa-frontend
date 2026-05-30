import React from "react";
import Link from "next/link";
import { ChevronLeft, XCircle } from "lucide-react";
import { getDsaArticle, getDsaSyllabus } from "@/utils/mdxLoader";
import DsaArticleReaderClient from "@/components/learn/DsaArticleReaderClient";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DsaDynamicArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams?.slug || [];
  const slug = slugArray.join("/");

  const article = getDsaArticle(slug);

  if (!article) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6">
        <div className="flex w-14 h-14 mx-auto items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10 mb-5">
          <XCircle size={28} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Article Not Found</h3>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
          The requested documentation page does not exist yet. Check the URL path or browse items in the left syllabus tree.
        </p>
        <Link 
          href="/learn/dsa"
          className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/15"
        >
          <ChevronLeft size={14} />
          <span>Back to DSA Home</span>
        </Link>
      </div>
    );
  }

  // Fetch full syllabus dynamically to trace previous/next article boundaries
  const syllabus = getDsaSyllabus();
  
  const getFlatArticlesList = () => {
    const list: { categoryId: string; slug: string; title: string }[] = [];
    syllabus.forEach((cat) => {
      cat.items.forEach((item) => {
        list.push({
          categoryId: cat.id,
          slug: `${cat.id}/${item.slug}`,
          title: item.title
        });
      });
    });
    return list;
  };

  const flatArticles = getFlatArticlesList();
  const currentIndex = flatArticles.findIndex((a) => a.slug === slug);
  const previousItem = currentIndex > 0 ? flatArticles[currentIndex - 1] : null;
  const nextItem = currentIndex !== -1 && currentIndex < flatArticles.length - 1 ? flatArticles[currentIndex + 1] : null;

  return (
    <DsaArticleReaderClient 
      article={article}
      slug={slug}
      previousItem={previousItem}
      nextItem={nextItem}
    />
  );
}
