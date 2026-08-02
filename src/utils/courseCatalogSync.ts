import { CourseSummary, CourseSection, CourseSectionItem } from "@/types/course";
import { BatchTopicResponse } from "@/api/courses";
import { DSATopicModule } from "@/config/dsa-catalog";

export interface HydratedSectionStats {
  chaptersCount: number;
  itemsCount: number;
  videosCount: number;
  problemsCount: number;
  articlesCount: number;
}

/**
 * Calculates dynamic counts of chapters (subsections), total items, videos, problems, and articles
 * for a specific course section.
 */
export function deriveSectionStats(section: CourseSection): HydratedSectionStats {
  let videosCount = 0;
  let problemsCount = 0;
  let articlesCount = 0;

  const subsections = section.subsections || [];
  const chaptersCount = subsections.length > 0 ? subsections.length : 1;

  const countItems = (items?: CourseSectionItem[]) => {
    (items || []).forEach((item) => {
      if (item.type === "video") videosCount++;
      else if (item.type === "problem") problemsCount++;
      else if (item.type === "article") articlesCount++;
    });
  };

  countItems(section.items);
  subsections.forEach((sub) => countItems(sub.items));

  const itemsCount = videosCount + problemsCount + articlesCount;

  return {
    chaptersCount,
    itemsCount,
    videosCount,
    problemsCount,
    articlesCount,
  };
}

/**
 * Hydrates topic modules using the batch API response.
 * Uses exact case-insensitive & trimmed title matching.
 */
export function hydrateModulesWithBatchResponse(
  modules: DSATopicModule[],
  batchResponse: BatchTopicResponse | null
): DSATopicModule[] {
  if (!batchResponse || !batchResponse.matched_topics) {
    return modules.map((mod) => ({
      ...mod,
      chaptersCount: 0,
      itemsCount: 0,
      isUpcoming: true,
    }));
  }

  const matchedMap = batchResponse.matched_topics;

  return modules.map((module) => {
    // Look up by module.id or module.title
    const matched = matchedMap[module.id] || matchedMap[module.title];

    if (!matched || !matched.found || matched.is_upcoming) {
      return {
        ...module,
        chaptersCount: 0,
        itemsCount: 0,
        lessonCount: 0,
        problemCount: 0,
        isUpcoming: true,
      };
    }

    const dynamicTopics: string[] = [];
    if (matched.videos_count > 0) dynamicTopics.push(`${matched.videos_count} Videos`);
    if (matched.problems_count > 0) dynamicTopics.push(`${matched.problems_count} Problems`);

    return {
      ...module,
      chaptersCount: matched.chapters_count,
      itemsCount: matched.items_count,
      lessonCount: matched.videos_count,
      problemCount: matched.problems_count,
      isUpcoming: false,
      topics: Array.from(new Set([...dynamicTopics, ...module.topics.slice(0, 2)])),
    };
  });
}
