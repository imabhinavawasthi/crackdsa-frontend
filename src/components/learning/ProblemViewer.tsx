"use client";

import React, { useState } from "react";
import { Zap, Code2, Clipboard, Check, Terminal, ExternalLink, Lightbulb, HelpCircle, Video, FileText } from "lucide-react";
import NotesTab from "./NotesTab";

interface SolutionItem {
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

interface ProblemSolutions {
  cpp: SolutionItem;
  python: SolutionItem;
  java: SolutionItem;
  javascript: SolutionItem;
}

interface ProblemDetail {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problemUrl: string;
  description: string;
  solutions: ProblemSolutions;
  companyTags?: string[];
  topicTags?: string[];
  hints?: string[];
}

const PROBLEM_DATABASE: Record<string, ProblemDetail> = {
  "reverse-an-array": {
    title: "Reverse an Array",
    difficulty: "Easy",
    platform: "LeetCode",
    problemUrl: "https://leetcode.com/problems/reverse-string/",
    description: `
      <p class="mb-4">Given an array (or string) of characters, write a function that reverses the array in-place.</p>
      <p class="mb-4">You must solve this by modifying the input array in-place with <code>O(1)</code> extra memory.</p>
      <h4 class="text-sm font-bold text-gray-900 dark:text-white mt-5 mb-2">Example 1:</h4>
      <pre class="bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl font-mono text-xs border border-gray-200 dark:border-gray-800/80 mb-4">Input: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]</pre>
      <h4 class="text-sm font-bold text-gray-900 dark:text-white mt-4 mb-2">Constraints:</h4>
      <ul class="list-disc pl-5 space-y-1 text-xs">
        <li><code>1 <= s.length <= 10<sup>5</sup></code></li>
        <li><code>s[i]</code> is a printable ascii character.</li>
      </ul>
    `,
    companyTags: ["Amazon", "Microsoft", "Adobe", "Google"],
    topicTags: ["Arrays", "Two Pointers"],
    hints: [
      "Try using two pointers: one at the start (index 0) and one at the end (index N-1).",
      "Swap the elements at these two pointers, then move the pointers towards the center.",
      "Stop when the left pointer is greater than or equal to the right pointer."
    ],
    solutions: {
      cpp: {
        code: `void reverseArray(vector<char>& s) {\n    int left = 0;\n    int right = s.size() - 1;\n    while (left < right) {\n        swap(s[left], s[right]);\n        left++;\n        right--;\n    }\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Uses a two-pointer approach starting from the outer boundaries and swapping elements in-place while moving towards the center."
      },
      python: {
        code: `def reverseArray(s: List[str]) -> None:\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Applies Pythonic simultaneous swap using a two-pointer approach, working in-place."
      },
      java: {
        code: `public void reverseArray(char[] s) {\n    int left = 0;\n    int right = s.length - 1;\n    while (left < right) {\n        char temp = s[left];\n        s[left] = s[right];\n        s[right] = temp;\n        left++;\n        right--;\n    }\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Java implementation using standard temporary variable swaps with a left and right pointer scanner."
      },
      javascript: {
        code: `var reverseArray = function(s) {\n    let left = 0;\n    let right = s.length - 1;\n    while (left < right) {\n        let temp = s[left];\n        s[left] = s[right];\n        s[right] = temp;\n        left++;\n        right--;\n    }\n};`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Vanilla JavaScript implementation maintaining two bounds pointers, changing the array in-place."
      }
    }
  },
  "find-min-max-array": {
    title: "Find Minimum and Maximum in Array",
    difficulty: "Easy",
    platform: "GFG",
    problemUrl: "https://www.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4428/1",
    description: `
      <p class="mb-4">Given an array of size <code>N</code>. Find the maximum and minimum elements in the array using the minimum number of comparisons.</p>
      <h4 class="text-sm font-bold text-gray-900 dark:text-white mt-5 mb-2">Example 1:</h4>
      <pre class="bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl font-mono text-xs border border-gray-200 dark:border-gray-800/80 mb-4">Input: arr = [3, 2, 1, 56, 10000, 167]\nOutput: min = 1, max = 10000</pre>
    `,
    companyTags: ["Amazon", "Flipkart", "Snapdeal", "Adobe"],
    topicTags: ["Arrays", "Searching"],
    hints: [
      "Initialize local min and max variables with the first element of the array.",
      "Iterate through the array and update the min/max elements continuously.",
      "To optimize comparisons, compare elements in pairs instead of individually."
    ],
    solutions: {
      cpp: {
        code: `pair<long long, long long> getMinMax(long long a[], int n) {\n    long long mn = a[0];\n    long long mx = a[0];\n    for (int i = 1; i < n; i++) {\n        if (a[i] < mn) mn = a[i];\n        else if (a[i] > mx) mx = a[i];\n    }\n    return {mn, mx};\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Scans arrays linearly while comparing elements to construct running minimum and maximum boundaries."
      },
      python: {
        code: `def getMinMax(arr: List[int]) -> Tuple[int, int]:\n    if not arr: return (0, 0)\n    mn = mx = arr[0]\n    for val in arr[1:]:\n        if val < mn: mn = val\n        elif val > mx: mx = val\n    return (mn, mx)`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Iterates through array slices from index 1, updating minimum and maximum trackers linearly."
      },
      java: {
        code: `public class Pair {\n    long first, second;\n    public Pair(long f, long s) { first = f; second = s; }\n}\n\nstatic Pair getMinMax(long a[], long n) {\n    long mn = a[0];\n    long mx = a[0];\n    for (int i = 1; i < (int)n; i++) {\n        if (a[i] < mn) mn = a[i];\n        else if (a[i] > mx) mx = a[i];\n    }\n    return new Pair(mn, mx);\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Standard Java iteration loop returning a custom structural Pair storing min/max element primitives."
      },
      javascript: {
        code: `function getMinMax(arr) {\n    let mn = arr[0];\n    let mx = arr[0];\n    for(let i = 1; i < arr.length; i++) {\n        if (arr[i] < mn) mn = arr[i];\n        else if (arr[i] > mx) mx = arr[i];\n    }\n    return { min: mn, max: mx };\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Single pass iteration comparing against active min and max local states, returning a structured object."
      }
    }
  },
  "valid-palindrome": {
    title: "Valid Palindrome",
    difficulty: "Easy",
    platform: "LeetCode",
    problemUrl: "https://leetcode.com/problems/valid-palindrome/",
    description: `
      <p class="mb-4">A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.</p>
      <p class="mb-4">Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.</p>
      <h4 class="text-sm font-bold text-gray-900 dark:text-white mt-5 mb-2">Example 1:</h4>
      <pre class="bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl font-mono text-xs border border-gray-200 dark:border-gray-800/80 mb-4">Input: s = "A man, a plan, a canal: Panama"\nOutput: true\nExplanation: "amanaplanacanalpanama" is a palindrome.</pre>
    `,
    companyTags: ["Facebook", "Microsoft", "Apple", "Google"],
    topicTags: ["Two Pointers", "Strings"],
    hints: [
      "Use two pointers starting at both ends of the string.",
      "Increment the left pointer or decrement the right pointer if the character is non-alphanumeric.",
      "Convert characters to lowercase before comparing."
    ],
    solutions: {
      cpp: {
        code: `bool isPalindrome(string s) {\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        if (!isalnum(s[l])) l++;\n        else if (!isalnum(s[r])) r--;\n        else {\n            if (tolower(s[l]) != tolower(s[r])) return false;\n            l++; r--;\n        }\n    }\n    return true;\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Two pointer scan bypassing non-alphanumeric values using `isalnum`, checking case-insensitive equality."
      },
      python: {
        code: `def isPalindrome(s: str) -> bool:\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower(): return False\n        l += 1; r -= 1\n    return True`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Maintains inner loops to quickly advance past whitespaces or marks, comparing character conversions."
      },
      java: {
        code: `public boolean isPalindrome(String s) {\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        char currLeft = s.charAt(l);\n        char currRight = s.charAt(r);\n        if (!Character.isLetterOrDigit(currLeft)) l++;\n        else if (!Character.isLetterOrDigit(currRight)) r--;\n        else {\n            if (Character.toLowerCase(currLeft) != Character.toLowerCase(currRight)) return false;\n            l++; r--;\n        }\n    }\n    return true;\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Bypasses special symbols via Java's `Character.isLetterOrDigit()`, checking toLowerCase equality."
      },
      javascript: {
        code: `var isPalindrome = function(s) {\n    let l = 0, r = s.length - 1;\n    const isAlphanumeric = char => /[a-zA-Z0-9]/.test(char);\n    while (l < r) {\n        if (!isAlphanumeric(s[l])) { l++; continue; }\n        if (!isAlphanumeric(s[r])) { r--; continue; }\n        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n        l++; r--;\n    }\n    return true;\n};`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Uses simple regex filters dynamically inside lower/upper bounds pointers scanners, evaluating matches."
      }
    }
  },
  "max-subarray": {
    title: "Maximum Subarray (Kadane's)",
    difficulty: "Medium",
    platform: "LeetCode",
    problemUrl: "https://leetcode.com/problems/maximum-subarray/",
    description: `
      <p class="mb-4">Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum.</p>
      <h4 class="text-sm font-bold text-gray-900 dark:text-white mt-5 mb-2">Example 1:</h4>
      <pre class="bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl font-mono text-xs border border-gray-200 dark:border-gray-800/80 mb-4">Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum = 6.</pre>
    `,
    companyTags: ["Amazon", "Microsoft", "Google", "Netflix"],
    topicTags: ["Dynamic Programming", "Arrays", "Kadane's Algorithm"],
    hints: [
      "Calculate the running sum of elements at each step.",
      "If the running sum falls below 0, reset it to 0 and start a new subarray.",
      "Track the maximum sum encountered throughout the iteration."
    ],
    solutions: {
      cpp: {
        code: `int maxSubArray(vector<int>& nums) {\n    int max_so_far = nums[0];\n    int curr_max = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        curr_max = max(nums[i], curr_max + nums[i]);\n        max_so_far = max(max_so_far, curr_max);\n    }\n    return max_so_far;\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Implementation of Kadane's algorithm. For each index, decides whether to extend the previous subarray or start a new one."
      },
      python: {
        code: `def maxSubArray(nums: List[int]) -> int:\n    max_so_far = curr_max = nums[0]\n    for val in nums[1:]:\n        curr_max = max(val, curr_max + val)\n        max_so_far = max(max_so_far, curr_max)\n    return max_so_far`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Applies DP logic dynamically in single pass. Decides maximum subarray sum at index i."
      },
      java: {
        code: `public int maxSubArray(int[] nums) {\n    int maxSoFar = nums[0];\n    int currMax = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Kadane's algorithm Java implementation with continuous Math.max updates tracking local maximum bounds."
      },
      javascript: {
        code: `var maxSubArray = function(nums) {\n    let maxSoFar = nums[0];\n    let currMax = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n};`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Kadane's method written in JS, keeping tracked current sum thresholds above 0 elements."
      }
    }
  },
  "max-depth-tree": {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    platform: "LeetCode",
    problemUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    description: `
      <p class="mb-4">Given the <code>root</code> of a binary tree, return its maximum depth.</p>
      <p class="mb-4">A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>
    `,
    companyTags: ["Amazon", "Google", "Microsoft", "LinkedIn"],
    topicTags: ["Trees", "Binary Trees", "DFS", "Recursion"],
    hints: [
      "The depth of a tree is 1 + the maximum depth of its left and right subtrees.",
      "Use recursion to evaluate subtrees bottom-up.",
      "Base case: If the node is null, return a depth of 0."
    ],
    solutions: {
      cpp: {
        code: `int maxDepth(TreeNode* root) {\n    if (root == nullptr) return 0;\n    int leftDepth = maxDepth(root->left);\n    int rightDepth = maxDepth(root->right);\n    return 1 + max(leftDepth, rightDepth);\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(H) / O(N)",
        explanation: "DFS recursion returning maximum depth of subtree child nodes plus 1 for the parent root."
      },
      python: {
        code: `def maxDepth(root: Optional[TreeNode]) -> int:\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(H)",
        explanation: "Recursive post-order traversal traversing bottom-up, resolving height boundaries."
      },
      java: {
        code: `public int maxDepth(TreeNode root) {\n    if (root == null) return 0;\n    return 1 + Math.max(maxDepth(root.left), Math.max(maxDepth(root.right)));\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(H)",
        explanation: "Elegant Java recursive traversal taking leaf node height boundaries and passing values up."
      },
      javascript: {
        code: `var maxDepth = function(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n};`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(H)",
        explanation: "DFS recursive standard solution in JS, calculating tree node structural heights."
      }
    }
  },
  "invert-binary-tree": {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    platform: "LeetCode",
    problemUrl: "https://leetcode.com/problems/invert-binary-tree/",
    description: `
      <p class="mb-4">Given the <code>root</code> of a binary tree, invert the tree, and return its root.</p>
    `,
    companyTags: ["Google", "Amazon", "Twitter", "Adobe"],
    topicTags: ["Trees", "Binary Trees", "DFS"],
    hints: [
      "At each node, swap its left and right children.",
      "Recursively call the invert function on both child nodes.",
      "Base case: If root is null, return null."
    ],
    solutions: {
      cpp: {
        code: `TreeNode* invertTree(TreeNode* root) {\n    if (root == nullptr) return nullptr;\n    TreeNode* temp = root->left;\n    root->left = invertTree(root->right);\n    root->right = invertTree(temp);\n    return root;\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(H)",
        explanation: "Inverts subtree nodes recursively. Swaps left and right pointers at every level bottom-up."
      },
      python: {
        code: `def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(H)",
        explanation: "Pythonic swap unpacking nodes while calling recursive subroutines."
      },
      java: {
        code: `public TreeNode invertTree(TreeNode root) {\n    if (root == null) return null;\n    TreeNode temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(H)",
        explanation: "Standard Java variable tree inversion. Updates pointers of children in post-order order."
      },
      javascript: {
        code: `var invertTree = function(root) {\n    if (!root) return null;\n    let temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n};`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(H)",
        explanation: "Recursive post-order element restructuring, updating left/right variables."
      }
    }
  },
  "climbing-stairs": {
    title: "Climbing Stairs (DP)",
    difficulty: "Easy",
    platform: "LeetCode",
    problemUrl: "https://leetcode.com/problems/climbing-stairs/",
    description: `
      <p class="mb-4">You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>
      <p class="mb-4">Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>
    `,
    companyTags: ["Google", "Amazon", "Apple", "Adobe"],
    topicTags: ["Dynamic Programming", "Math", "Memoization"],
    hints: [
      "To reach step N, you can come from either step N-1 or step N-2.",
      "Thus, the number of ways to reach step N is Ways(N-1) + Ways(N-2).",
      "This is equivalent to calculating the N-th Fibonacci number."
    ],
    solutions: {
      cpp: {
        code: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int first = 1;\n    int second = 2;\n    for (int i = 3; i <= n; i++) {\n        int third = first + second;\n        first = second;\n        second = third;\n    }\n    return second;\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Uses bottom-up iterative DP to save space. Behaves exactly like the Fibonacci sequence tracker."
      },
      python: {
        code: `def climbStairs(n: int) -> int:\n    if n <= 2: return n\n    first, second = 1, 2\n    for _ in range(3, n + 1):\n        first, second = second, first + second\n    return second`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Keeps space optimization down by utilizing just two state holders dynamically."
      },
      java: {
        code: `public int climbStairs(int n) {\n    if (n <= 2) return n;\n    int first = 1, second = 2;\n    for (int i = 3; i <= n; i++) {\n        int third = first + second;\n        first = second;\n        second = third;\n    }\n    return second;\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Standard Java loop scaling sum configurations bottom-up, keeping spatial variables minimal."
      },
      javascript: {
        code: `var climbStairs = function(n) {\n    if (n <= 2) return n;\n    let first = 1, second = 2;\n    for (let i = 3; i <= n; i++) {\n        let third = first + second;\n        first = second;\n        second = third;\n    }\n    return second;\n};`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Simple DP array replacement in vanilla JavaScript resolving climbing sequences."
      }
    }
  }
};

const EDITORIAL_VIDEOS: Record<string, { title: string; youtubeId: string; description: string }> = {
  "reverse-an-array": {
    title: "Session Walkthrough: Memory Layout & Reversing Elements In-Place",
    youtubeId: "9Hdf8_y4s_A",
    description: "Watch Ex-Google SDE Abhinav Awasthi trace compilation models, memory address references, and in-place reversal pointer dry-runs."
  },
  "find-min-max-array": {
    title: "Session Walkthrough: Optimal Arrays Scaling & Linear Scans",
    youtubeId: "9Hdf8_y4s_A",
    description: "Dry-run and comparison optimizations explanation to build optimal min/max linear boundaries."
  },
  "valid-palindrome": {
    title: "Session Walkthrough: Two Pointers Strategy & Linear Scans",
    youtubeId: "t3W8l0N27-c",
    description: "Watch the comprehensive Two-Pointer live session covering borders contraction, skip bounds alphanumeric checks, and dry-runs."
  },
  "max-subarray": {
    title: "Session Walkthrough: Kadane's Optimal DP Max Sum Subarray",
    youtubeId: "t3W8l0N27-c",
    description: "Dry-run analysis of Kadane's algorithm decision boundaries, resetting sum states below 0, and dynamic subarrays."
  },
  "max-depth-tree": {
    title: "Session Walkthrough: Binary Tree DFS Recursion & Call Stacks",
    youtubeId: "fAAZixBjIAI",
    description: "DFS traversal tracing call stack frame entries, evaluating recursive tree depths, and combining heights."
  },
  "invert-binary-tree": {
    title: "Session Walkthrough: Binary Tree Child Pointer Swaps",
    youtubeId: "fAAZixBjIAI",
    description: "Recursive post-order structural traversals and dry-runs for inverting binary child pointers in-place."
  },
  "climbing-stairs": {
    title: "Session Walkthrough: DP Caching & Iterative Tabulation",
    youtubeId: "oBt53YbR9K8",
    description: "Trace overlapping recursion calls, apply Top-Down Memoization cache arrays, and build space-optimized O(1) iterative bottom-up loops."
  }
};

// Client-side regex-based syntax highlighter for premium coding appearance
const highlightCode = (code: string, lang: string): string => {
  // Escape HTML entities to prevent rendering issues
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (lang === "cpp" || lang === "java" || lang === "javascript") {
    // Comments: // ...
    html = html.replace(/(\/\/.*)/g, '<span class="text-emerald-500 font-medium font-mono">$1</span>');
    // Double quoted strings
    html = html.replace(/(&quot;[^\n]*?&quot;)/g, '<span class="text-amber-400 font-mono">$1</span>');
    // Single quoted strings
    html = html.replace(/(&#39;[^\n]*?&#39;)/g, '<span class="text-amber-400 font-mono">$1</span>');
    // Keywords
    const keywords = /\b(const|let|var|function|return|class|public|private|void|int|double|bool|boolean|char|float|long|vector|pair|while|for|if|else|swap|tolower|isalnum|Character|Math|Math\.max|Math\.min|max|min|nullptr|null|true|false)\b/g;
    html = html.replace(keywords, '<span class="text-purple-400 dark:text-purple-400 font-bold font-mono">$1</span>');
  } else if (lang === "python") {
    // Comments: # ...
    html = html.replace(/(#.*)/g, '<span class="text-emerald-500 font-medium font-mono">$1</span>');
    // Strings
    html = html.replace(/(&quot;[^\n]*?&quot;)/g, '<span class="text-amber-400 font-mono">$1</span>');
    html = html.replace(/(&#39;[^\n]*?&#39;)/g, '<span class="text-amber-400 font-mono">$1</span>');
    // Keywords
    const keywords = /\b(def|return|class|while|for|in|if|elif|else|and|or|not|None|True|False|List|Tuple|Optional|swap|len|max|min|range)\b/g;
    html = html.replace(keywords, '<span class="text-purple-400 dark:text-purple-400 font-bold font-mono">$1</span>');
  }

  return html;
};

interface ProblemViewerProps {
  slug: string;
  problemData?: any;
}

const ProblemViewer: React.FC<ProblemViewerProps> = ({ slug, problemData }) => {
  const [activeTab, setActiveTab] = useState<"statement" | "solutions" | "editorial" | "notes">("statement");
  const [activeLang, setActiveLang] = useState<"cpp" | "python" | "java" | "javascript">("cpp");
  const [copied, setCopied] = useState(false);
  const [expandedHints, setExpandedHints] = useState<Record<string, boolean>>({});

  // If problemData is missing, render error layout (No Mock Data Fallback!)
  if (!problemData) {
    return (
      <div className="w-full min-h-[350px] rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/10">
          <HelpCircle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-red-600">Practice Problem Not Found</h4>
          <p className="text-xs text-red-500/80 mt-1 font-semibold max-w-md">
            The specifications for this coding problem are not available in the database. Check your syllabus details or try again.
          </p>
        </div>
      </div>
    );
  }

  // Construct problem details from dynamic data
  const problem: ProblemDetail = {
    title: problemData.title || "Untitled Problem",
    difficulty: (problemData.difficulty || "Medium") as "Easy" | "Medium" | "Hard",
    platform: problemData.platform || "Internal",
    problemUrl: problemData.problem_url || problemData.problemUrl || "",
    description: problemData.description || "",
    solutions: {
      cpp: {
        code: problemData.solutions?.cpp?.code || (typeof problemData.solutions?.cpp === "string" ? problemData.solutions.cpp : "") || "// C++ Solution is not provided",
        timeComplexity: problemData.solutions?.cpp?.time_complexity || problemData.solutions?.cpp?.timeComplexity || "",
        spaceComplexity: problemData.solutions?.cpp?.space_complexity || problemData.solutions?.cpp?.spaceComplexity || "",
        explanation: problemData.solutions?.cpp?.explanation || ""
      },
      python: {
        code: problemData.solutions?.python?.code || (typeof problemData.solutions?.python === "string" ? problemData.solutions.python : "") || "# Python Solution is not provided",
        timeComplexity: problemData.solutions?.python?.time_complexity || problemData.solutions?.python?.timeComplexity || "",
        spaceComplexity: problemData.solutions?.python?.space_complexity || problemData.solutions?.python?.spaceComplexity || "",
        explanation: problemData.solutions?.python?.explanation || ""
      },
      java: {
        code: problemData.solutions?.java?.code || (typeof problemData.solutions?.java === "string" ? problemData.solutions.java : "") || "// Java Solution is not provided",
        timeComplexity: problemData.solutions?.java?.time_complexity || problemData.solutions?.java?.timeComplexity || "",
        spaceComplexity: problemData.solutions?.java?.space_complexity || problemData.solutions?.java?.spaceComplexity || "",
        explanation: problemData.solutions?.java?.explanation || ""
      },
      javascript: {
        code: problemData.solutions?.javascript?.code || (typeof problemData.solutions?.javascript === "string" ? problemData.solutions.javascript : "") || "// JavaScript Solution is not provided",
        timeComplexity: problemData.solutions?.javascript?.time_complexity || problemData.solutions?.javascript?.timeComplexity || "",
        spaceComplexity: problemData.solutions?.javascript?.space_complexity || problemData.solutions?.javascript?.spaceComplexity || "",
        explanation: problemData.solutions?.javascript?.explanation || ""
      }
    },
    companyTags: problemData.attributes?.company_tags || problemData.attributes?.companyTags || [],
    topicTags: problemData.attributes?.tags || problemData.attributes?.topicTags || [],
    hints: problemData.attributes?.hints || []
  };

  const activeSolution = problem.solutions[activeLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSolution.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleHint = (key: string) => {
    setExpandedHints((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const editorial = EDITORIAL_VIDEOS[slug];
  const codeLines = activeSolution.code.split("\n");

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      
      {/* 1. LeetCode-Style Top Navigation Bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm shrink-0">
        {([
          { id: "statement", label: "Problem Statement", icon: <HelpCircle size={14} /> },
          { id: "solutions", label: "Solutions & Code", icon: <Code2 size={14} /> },
          { id: "editorial", label: "Video Editorial", icon: <Video size={14} /> },
          { id: "notes", label: "Notes & Discussion", icon: <FileText size={14} /> }
        ] as const).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive 
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Tab Contents Stage Area */}
      <div className="flex-1 w-full">
        
        {/* TAB: Problem Statement */}
        {activeTab === "statement" && (
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 flex flex-col justify-between shadow-sm max-w-4xl mx-auto w-full space-y-6">
            
            {/* Header section with re-positioned solve button */}
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
              <div className="space-y-3 flex-1 min-w-[200px]">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                    problem.difficulty === "Easy" 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/10"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10"
                  }`}>
                    <Zap size={11} fill="currentColor" />
                    <span>{problem.difficulty}</span>
                  </span>

                  <span className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-gray-700">
                    {problem.platform}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-snug">
                  {problem.title}
                </h2>
              </div>

              {/* Solve External platform Button - Placed elegantly on the top-right header */}
              <a 
                href={problem.problemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-4.5 text-xs shadow-md shadow-brand-500/15 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Solve on {problem.platform}</span>
                <ExternalLink size={12} className="stroke-[2.5]" />
              </a>
            </div>

            {/* Problem Description HTML Area */}
            <div 
              className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-semibold leading-relaxed max-h-[350px] overflow-y-auto no-scrollbar pr-1"
              dangerouslySetInnerHTML={{ __html: problem.description }}
            />

            {/* Topic/Company tags & Step-by-Step Hints */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
              
              {/* Tags Area */}
              <div className="flex flex-wrap gap-6">
                {problem.topicTags && problem.topicTags.length > 0 && (
                  <div className="space-y-2 flex-1 min-w-[200px]">
                    <h4 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">Topic Tags</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {problem.topicTags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg bg-blue-500/5 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {problem.companyTags && problem.companyTags.length > 0 && (
                  <div className="space-y-2 flex-1 min-w-[200px]">
                    <h4 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">Company Tags</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {problem.companyTags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-450 text-[10px] font-bold border border-gray-200 dark:border-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* LeetCode style step-by-step interview hints */}
              {problem.hints && problem.hints.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">Problem Interview Hints</h4>
                  <div className="space-y-2.5 pt-1">
                    {problem.hints.map((hint, index) => {
                      const hintKey = `${slug}-hint-${index}`;
                      const isExpanded = !!expandedHints[hintKey];
                      return (
                        <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/20 dark:bg-gray-900/10">
                          <button
                            onClick={() => toggleHint(hintKey)}
                            className="w-full flex items-center justify-between px-4.5 py-3 text-[11px] font-bold text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all text-left cursor-pointer"
                          >
                            <span>Hint {index + 1}</span>
                            <span className="text-[10px] font-bold text-brand-500 dark:text-brand-400">{isExpanded ? "Hide" : "Show"}</span>
                          </button>
                          {isExpanded && (
                            <div className="px-4.5 pb-4 pt-2 text-xs text-gray-500 dark:text-gray-405 leading-relaxed font-semibold border-t border-gray-100 dark:border-gray-800">
                              {hint}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB: Solutions & Code */}
        {activeTab === "solutions" && (
          <div className="rounded-3xl bg-gray-950 border border-gray-800 flex flex-col overflow-hidden shadow-xl text-gray-200 max-w-4xl mx-auto w-full">
            
            {/* Languages Selection Menu */}
            <div className="flex items-center justify-between px-4.5 py-3 bg-gray-900/60 border-b border-gray-800 select-none">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-brand-400" />
                <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Solution Explorer</span>
              </div>

              <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
                {(["cpp", "python", "java", "javascript"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeLang === lang 
                        ? "bg-brand-500 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {lang === "cpp" ? "C++" : lang === "javascript" ? "JS" : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom High-Fidelity IDE Viewport with Line Numbers and Syntax Highlighting */}
            <div className="flex-1 flex flex-col min-h-[350px] bg-gray-950 font-mono text-xs overflow-hidden relative">
              
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white/60 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer z-10"
                title="Copy Code"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Clipboard size={13} />}
              </button>

              <div className="flex-1 overflow-auto custom-scrollbar p-5">
                <table className="w-full border-collapse font-mono">
                  <tbody>
                    {codeLines.map((line, index) => (
                      <tr key={index} className="hover:bg-white/[0.03] transition-colors leading-relaxed">
                        {/* Line Number Column */}
                        <td className="w-10 pr-4 select-none text-right text-[10px] font-bold text-gray-600 dark:text-gray-700 font-mono border-r border-gray-800">
                          {index + 1}
                        </td>
                        {/* Code Line Column */}
                        <td 
                          className="pl-4 font-mono text-xs whitespace-pre text-gray-300"
                          dangerouslySetInnerHTML={{ __html: highlightCode(line, activeLang) }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Complexity Analysis & Annotations Panel */}
            <div className="bg-gray-900/90 border-t border-gray-800 p-5 space-y-4 select-none">
              <div className="flex items-center gap-4.5">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Time Complexity</span>
                  <span className="text-xs font-bold text-brand-400 mt-1">{activeSolution.timeComplexity}</span>
                </div>
                <div className="w-[1px] h-8 bg-gray-800 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Space Complexity</span>
                  <span className="text-xs font-bold text-brand-400 mt-1">{activeSolution.spaceComplexity}</span>
                </div>
              </div>

              <div className="flex gap-2.5 bg-gray-950/50 rounded-xl p-3.5 border border-gray-800/60">
                <Lightbulb size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold leading-relaxed text-gray-400">
                  {activeSolution.explanation}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB: Video Editorial */}
        {activeTab === "editorial" && (
          editorial ? (
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto w-full shadow-sm">
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Video size={16} className="text-brand-500" />
                  <span>{editorial.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {editorial.description}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-video border border-gray-200 dark:border-gray-800 shadow-inner bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${editorial.youtubeId}?rel=0`}
                  title={editorial.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-4xl mx-auto w-full shadow-sm">
              <p className="text-xs sm:text-sm text-gray-405 dark:text-gray-500 font-medium">Video Editorial explanation is currently under edit. Check back soon!</p>
            </div>
          )
        )}

        {/* TAB: Notes & Discussion */}
        {activeTab === "notes" && (
          <div className="max-w-4xl mx-auto w-full">
            <NotesTab
              courseId="dsa-bootcamp-recordings"
              itemId={`problem-${slug}`}
            />
          </div>
        )}

      </div>

    </div>
  );
};

export default ProblemViewer;
