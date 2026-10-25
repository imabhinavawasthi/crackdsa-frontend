export interface TestCase {
  id: string;
  name: string;
  inputs: Record<string, string>;
  expectedOutput: string;
}

export interface ProblemSolveData {
  id: number;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isSolved: boolean;
  likes: string;
  dislikes: string;
  commentsCount: string;
  onlineCount: number;
  tags: string[];
  companies: string[];
  hints: string[];
  description: {
    statement: string;
    note?: string;
    examples: Array<{
      input: string;
      output: string;
      explanation?: string;
    }>;
    constraints: string[];
  };
  starterCode: {
    java: string;
    python3: string;
    cpp: string;
    javascript: string;
    typescript: string;
  };
  testcases: TestCase[];
  editorial: {
    summary: string;
    approaches: Array<{
      title: string;
      timeComplexity: string;
      spaceComplexity: string;
      intuition: string;
      algorithm: string[];
      codeSnippet: string;
      language: string;
    }>;
  };
  solutions: Array<{
    author: string;
    avatar: string;
    title: string;
    votes: number;
    tags: string[];
    language: string;
    code: string;
  }>;
}

export const SOLVE_PROBLEMS: Record<string, ProblemSolveData> = {
  "two-sum": {
    id: 1,
    slug: "two-sum",
    title: "1. Two Sum",
    difficulty: "Easy",
    isSolved: true,
    likes: "70.9K",
    dislikes: "2.1K",
    commentsCount: "2.2K",
    onlineCount: 1068,
    tags: ["Array", "Hash Table"],
    companies: ["Amazon", "Google", "Meta", "Apple", "Microsoft"],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.",
      "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x, where value is the input parameter. Can we change our array somehow so that this search becomes faster?",
      "The second train of thought is, without changing the array, can we use additional space like a hash map to look up if the required number exists in O(1) time?",
    ],
    description: {
      statement:
        "You are given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.\n\nYou can return the answer in any order.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "The sum of nums[0] and nums[1] is 2 + 7 = 9, which equals the target. Therefore, the indices [0, 1] are returned.",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "The sum of nums[1] and nums[2] is 2 + 4 = 6, which equals the target. Therefore, the indices [1, 2] are returned.",
        },
        {
          input: "nums = [3,3], target = 6",
          output: "[0,1]",
        },
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists.",
      ],
    },
    starterCode: {
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
      python3: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hash_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hash_map:
                return [hash_map[complement], i]
            hash_map[num] = i
        return []`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
    },
    testcases: [
      {
        id: "case-1",
        name: "Case 1",
        inputs: {
          nums: "[2,7,11,15]",
          target: "9",
        },
        expectedOutput: "[0,1]",
      },
      {
        id: "case-2",
        name: "Case 2",
        inputs: {
          nums: "[3,2,4]",
          target: "6",
        },
        expectedOutput: "[1,2]",
      },
      {
        id: "case-3",
        name: "Case 3",
        inputs: {
          nums: "[3,3]",
          target: "6",
        },
        expectedOutput: "[0,1]",
      },
    ],
    editorial: {
      summary:
        "The problem requires finding two distinct elements in an array that add up to a specified target. While a brute-force approach requires quadratic time, using an auxiliary hash map reduces the lookup time to O(1) per element.",
      approaches: [
        {
          title: "Approach 1: One-pass Hash Table (Optimal)",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          intuition:
            "While iterating and inserting elements into the table, we also look back to check if the current element's complement already exists in the table. If it exists, we have found a solution and return immediately.",
          algorithm: [
            "Initialize an empty hash map storing value -> index.",
            "Iterate through the array with index i and value nums[i].",
            "Calculate complement = target - nums[i].",
            "If complement exists in map, return [map[complement], i].",
            "Otherwise insert nums[i] -> i into the map.",
          ],
          language: "java",
          codeSnippet: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[] {};
}`,
        },
        {
          title: "Approach 2: Brute Force",
          timeComplexity: "O(n^2)",
          spaceComplexity: "O(1)",
          intuition:
            "Loop through each element x and search if there is another value that equals target - x.",
          algorithm: [
            "Outer loop runs from i = 0 to n-1.",
            "Inner loop runs from j = i + 1 to n-1.",
            "Check if nums[i] + nums[j] == target. Return [i, j].",
          ],
          language: "java",
          codeSnippet: `public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[j] == target - nums[i]) {
                return new int[] { i, j };
            }
        }
    }
    return new int[] {};
}`,
        },
      ],
    },
    solutions: [
      {
        author: "stefanpochmann",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
        title: "Clean One-Pass Hash Map with O(N) Time and O(N) Space",
        votes: 14205,
        tags: ["Hash Table", "Optimal", "Java"],
        language: "java",
        code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> prevMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (prevMap.containsKey(diff)) {
                return new int[] { prevMap.get(diff), i };
            }
            prevMap.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      },
      {
        author: "nealcrucis",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
        title: "Python 3: 4 lines using enumerate dictionary lookup",
        votes: 9812,
        tags: ["Python", "Hash Table", "Beginner"],
        language: "python3",
        code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, val in enumerate(nums):
            remaining = target - val
            if remaining in seen:
                return [seen[remaining], i]
            seen[val] = i`,
      },
    ],
  },
  "valid-parentheses": {
    id: 20,
    slug: "valid-parentheses",
    title: "20. Valid Parentheses",
    difficulty: "Easy",
    isSolved: false,
    likes: "25.4K",
    dislikes: "1.4K",
    commentsCount: "1.1K",
    onlineCount: 940,
    tags: ["String", "Stack"],
    companies: ["Amazon", "Google", "Bloomberg", "Microsoft", "Meta"],
    hints: [
      "Use a stack of characters.",
      "When you encounter an opening bracket, push it to the stack.",
      "When you encounter a closing bracket, check whether the top element matches.",
    ],
    description: {
      statement:
        "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
      examples: [
        {
          input: 's = "()"',
          output: "true",
        },
        {
          input: 's = "()[]{}"',
          output: "true",
        },
        {
          input: 's = "(]"',
          output: "false",
        },
      ],
      constraints: [
        "1 <= s.length <= 10^4",
        "s consists of parentheses only '()[]{}'.",
      ],
    },
    starterCode: {
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      python3: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      javascript: `var isValid = function(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (let char of s) {
        if (char in map) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
};`,
      typescript: `function isValid(s: string): boolean {
    const stack: string[] = [];
    const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
        if (char in map) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
};`,
    },
    testcases: [
      {
        id: "case-1",
        name: "Case 1",
        inputs: { s: '"()"' },
        expectedOutput: "true",
      },
      {
        id: "case-2",
        name: "Case 2",
        inputs: { s: '"()[]{}"' },
        expectedOutput: "true",
      },
      {
        id: "case-3",
        name: "Case 3",
        inputs: { s: '"(]"' },
        expectedOutput: "false",
      },
    ],
    editorial: {
      summary: "Using a LIFO Stack structure matches brackets naturally.",
      approaches: [
        {
          title: "Stack Matching",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          intuition: "Whenever an opening bracket appears, expect matching closer.",
          algorithm: ["Push opening brackets", "Pop and verify on closers", "Check stack is empty at end"],
          language: "java",
          codeSnippet: `public boolean isValid(String s) { ... }`,
        },
      ],
    },
    solutions: [],
  },
  "3sum": {
    id: 15,
    slug: "3sum",
    title: "15. 3Sum",
    difficulty: "Medium",
    isSolved: false,
    likes: "31.2K",
    dislikes: "2.8K",
    commentsCount: "1.9K",
    onlineCount: 1420,
    tags: ["Array", "Two Pointers", "Sorting"],
    companies: ["Amazon", "Meta", "Google", "Apple", "Microsoft"],
    hints: [
      "So, we essentially need to find three numbers x, y, and z such that they add up to the given value.",
      "If we sort the array, we can fix x and use two pointers to find y and z in O(n) time.",
    ],
    description: {
      statement:
        "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
      examples: [
        {
          input: "nums = [-1,0,1,2,-1,-4]",
          output: "[[-1,-1,2],[-1,0,1]]",
          explanation: "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. The distinct triplets are [-1,0,1] and [-1,-1,2].",
        },
        {
          input: "nums = [0,1,1]",
          output: "[]",
        },
        {
          input: "nums = [0,0,0]",
          output: "[[0,0,0]]",
        },
      ],
      constraints: [
        "3 <= nums.length <= 3000",
        "-10^5 <= nums[i] <= 10^5",
      ],
    },
    starterCode: {
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }
}`,
      python3: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        for i, a in enumerate(nums):
            if i > 0 and a == nums[i - 1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                three_sum = a + nums[l] + nums[r]
                if three_sum > 0:
                    r -= 1
                elif three_sum < 0:
                    l += 1
                else:
                    res.append([a, nums[l], nums[r]])
                    l += 1
                    r -= 1
                    while nums[l] == nums[l - 1] and l < r:
                        l += 1
        return res`,
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < nums.size(); i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
      javascript: `var threeSum = function(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
};`,
      typescript: `function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
};`,
    },
    testcases: [
      {
        id: "case-1",
        name: "Case 1",
        inputs: { nums: "[-1,0,1,2,-1,-4]" },
        expectedOutput: "[[-1,-1,2],[-1,0,1]]",
      },
      {
        id: "case-2",
        name: "Case 2",
        inputs: { nums: "[0,1,1]" },
        expectedOutput: "[]",
      },
      {
        id: "case-3",
        name: "Case 3",
        inputs: { nums: "[0,0,0]" },
        expectedOutput: "[[0,0,0]]",
      },
    ],
    editorial: {
      summary: "Sort the array and run two-pointers for every pivot element.",
      approaches: [
        {
          title: "Sorting and Two Pointers",
          timeComplexity: "O(n^2)",
          spaceComplexity: "O(1) auxiliary",
          intuition: "Fix element at index i, search remaining with two pointers.",
          algorithm: ["Sort", "Loop i", "While left < right move pointers based on sum"],
          language: "java",
          codeSnippet: `// see starter code`,
        },
      ],
    },
    solutions: [],
  },
};

export const ALL_SOLVE_PROBLEMS_LIST = [
  { id: 1, slug: "two-sum", title: "Two Sum", difficulty: "Easy", solved: true },
  { id: 15, slug: "3sum", title: "3Sum", difficulty: "Medium", solved: false },
  { id: 20, slug: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy", solved: false },
  { id: 21, slug: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", difficulty: "Easy", solved: false },
  { id: 121, slug: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", solved: true },
  { id: 42, slug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", solved: false },
];

export function getProblemData(slug: string): ProblemSolveData {
  if (SOLVE_PROBLEMS[slug]) {
    return SOLVE_PROBLEMS[slug];
  }

  // Fallback dynamic generator for any slug
  const titleFormatted = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: 100,
    slug,
    title: `100. ${titleFormatted}`,
    difficulty: "Medium",
    isSolved: false,
    likes: "1.4K",
    dislikes: "80",
    commentsCount: "340",
    onlineCount: 420,
    tags: ["Algorithms", "Problem Solving"],
    companies: ["Google", "Amazon"],
    hints: ["Consider edge cases and optimal data structures."],
    description: {
      statement: `Given the input parameters for \`${slug}\`, design an optimal algorithm to solve the problem efficiently.\n\nMake sure to analyze both time and space complexity.`,
      examples: [
        {
          input: "input = [1, 2, 3]",
          output: "[1, 2, 3]",
          explanation: "Example explanation for this problem instance.",
        },
      ],
      constraints: ["1 <= input.length <= 10^5"],
    },
    starterCode: {
      java: `class Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}`,
      python3: `class Solution:\n    def solve(self):\n        # Write your solution here\n        pass`,
      cpp: `class Solution {\npublic:\n    void solve() {\n        // Write your solution here\n    }\n};`,
      javascript: `var solve = function() {\n    // Write your solution here\n};`,
      typescript: `function solve(): void {\n    // Write your solution here\n};`,
    },
    testcases: [
      {
        id: "case-1",
        name: "Case 1",
        inputs: { input: "[1,2,3]" },
        expectedOutput: "[1,2,3]",
      },
    ],
    editorial: {
      summary: "Detailed editorial and explanation for this problem.",
      approaches: [
        {
          title: "Optimal Solution",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          intuition: "Linear scan with pointer optimization.",
          algorithm: ["Initialize pointers", "Iterate array", "Return answer"],
          language: "java",
          codeSnippet: `// Solution code`,
        },
      ],
    },
    solutions: [],
  };
}
