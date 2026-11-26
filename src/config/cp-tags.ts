/**
 * Codeforces Problem Topic Tag Mappings for Newbie to Expert CP Sheet
 */
export const CP_PROBLEM_TOPICS: Record<string, string[]> = {
  "Luntik and Concerts": ["Implementation", "Math"],
  "Mathematical Addition": ["Math"],
  "Median Maximization": ["Greedy", "Sortings"],
  "A.M. Deviation": ["Math", "Implementation"],
  "Median of an Array": ["Arrays", "Sortings"],
  "Gamer Hemose": ["Implementation"],
  "Special Characters": ["Strings"],
  "Era": ["Math"],
  "Destroying Bridges": ["Graph Theory"],
  "Consecutive Sum Riddle": ["Math", "Prefix Sum"],
  "Anti-Fibonacci Permutation": ["Constructive", "Arrays"],
  "Elections": ["Math", "Implementation"],
  "Minority": ["Strings", "Greedy"],
  "Luntik and Subsequences": ["Combinatorics", "Math"],
  "Power Walking": ["Greedy", "Sortings"],
  "Exciting Bets": ["Math", "Number Theory"],
  "AB Balance": ["Strings", "Greedy"],
  "Array Eversion": ["Arrays", "Greedy"],
  "MIN-MEX Cut": ["Bitmasks", "Greedy"],
  "Customising the Track": ["Math", "Greedy"],
  "Make it Divisible by 25": ["Math", "Greedy"],
  "Regular Bracket Sequences": ["Strings", "Implementation"],
  "Team Composition": ["Binary Search", "Math"],
  "MAX-MEX Cut": ["Dynamic Programming", "Greedy"],
  "Polycarp Recovers the Permutation": ["Constructive", "Two Pointers"],
  "Reverse Sort": ["Sortings", "Greedy"],
  "Missing Bigram": ["Strings", "Implementation"],
  "Rudolf and 121": ["Greedy", "Arrays"],
  "Rudolf and the Ugly String": ["Strings", "Greedy"],
  "Coloring Rectangles": ["Math", "Geometry"],
  "Mocha and Math": ["Bitmasks", "Math"],
  "Make AP": ["Math", "Implementation"],
  "Plus One on the Subset": ["Arrays", "Math"],
  "Division by Two and Permutation": ["Greedy", "Data Structures"],
  "Download More RAM": ["Greedy", "Sortings"],
  "GCD Arrays": ["Number Theory", "Math"],
  "Subtle Substring Subtraction": ["Strings", "Games"],
  "Make The Fence Great Again": ["Dynamic Programming"],
  "Odd Swap Sort": ["Sortings", "Arrays"],
  "Great Sequence": ["Greedy", "Data Structures"],
  "Madoka and the Elegant Gift": ["Implementation", "Constructive"],
  "Watermelon": ["Math", "Brute Force"],
  "Way Too Long Words": ["Strings"],
  "Next Round": ["Implementation"],
  "Domino piling": ["Math", "Greedy"],
  "Bit++": ["Implementation"],
  "Beautiful Matrix": ["Implementation"],
  "Petya and Strings": ["Strings", "Implementation"],
  "Helpful Maths": ["Sortings", "Strings"],
  "Word Capitalization": ["Strings"],
  "Elephant": ["Math", "Greedy"],
  "Soldier and Bananas": ["Math"],
  "Bear and Big Brother": ["Implementation"],
  "Wrong Subtraction": ["Implementation"],
  "Nearly Lucky Number": ["Implementation"],
  "Anton and Danik": ["Strings"],
  "Translation": ["Strings"],
  "Vanya and Fence": ["Implementation"],
  "In Search of an Easy Problem": ["Implementation"],
  "Calculating Function": ["Math"],
  "Magnets": ["Implementation"],
  "George and Accommodation": ["Implementation"],
  "Hulk": ["Implementation"],
  "Queue at the School": ["Implementation"],
  "Presents": ["Implementation"],
  "I Wanna Be the Guy": ["Implementation"],
  "Is your horseshoe on the other hoof?": ["Implementation"],
  "Ultra-Fast Mathematician": ["Implementation"],
  "Stones on the Table": ["Implementation"],
  "Boy or Girl": ["Strings"],
};

/**
 * Returns topic tags for a CP problem, with intelligent fallbacks.
 */
export function getProblemTopics(problemName: string, difficulty: number): string[] {
  const trimmed = (problemName || "").trim();
  if (CP_PROBLEM_TOPICS[trimmed]) {
    return CP_PROBLEM_TOPICS[trimmed];
  }

  // Fallback heuristics based on title keywords
  const lower = trimmed.toLowerCase();
  const inferred: string[] = [];

  if (lower.includes("string") || lower.includes("bracket") || lower.includes("char") || lower.includes("word")) {
    inferred.push("Strings");
  }
  if (lower.includes("tree") || lower.includes("path")) {
    inferred.push("Trees");
  }
  if (lower.includes("graph") || lower.includes("bridge") || lower.includes("edge")) {
    inferred.push("Graph Theory");
  }
  if (lower.includes("math") || lower.includes("divis") || lower.includes("sum") || lower.includes("number") || lower.includes("gcd")) {
    inferred.push("Math");
  }
  if (lower.includes("array") || lower.includes("subsequence") || lower.includes("permutation") || lower.includes("subset")) {
    inferred.push("Arrays");
  }
  if (lower.includes("sort") || lower.includes("median") || lower.includes("order")) {
    inferred.push("Sortings");
  }

  if (inferred.length === 0) {
    if (difficulty <= 1000) {
      inferred.push("Implementation", "Math");
    } else if (difficulty <= 1200) {
      inferred.push("Greedy", "Arrays");
    } else if (difficulty <= 1400) {
      inferred.push("Two Pointers", "Binary Search");
    } else {
      inferred.push("Dynamic Programming", "Data Structures");
    }
  }

  return inferred.slice(0, 3);
}

export const ALL_AVAILABLE_TAGS = [
  "All Tags",
  "Implementation",
  "Math",
  "Greedy",
  "Sortings",
  "Arrays",
  "Strings",
  "Graph Theory",
  "Prefix Sum",
  "Binary Search",
  "Two Pointers",
  "Dynamic Programming",
  "Number Theory",
  "Bitmasks",
  "Constructive",
  "Data Structures",
];
