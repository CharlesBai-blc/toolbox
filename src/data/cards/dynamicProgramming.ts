import type { Card } from '../../types/card';

export const dynamicProgrammingCard: Card = {
  id: 'dynamic-programming',
  title: 'Dynamic Programming',
  classification: 'algorithms',
  difficulty: 'medium',
  code: `// Fibonacci with memoization
function fibonacci(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  
  memo.set(n, fibonacci(n - 1, memo) + fibonacci(n - 2, memo));
  return memo.get(n)!;
}

// Bottom-up approach
function fibonacciBottomUp(n: number): number {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}`,
  explanation: 'Dynamic Programming is an optimization technique that solves complex problems by breaking them down into simpler subproblems. It stores the results of subproblems to avoid recomputing them. Key characteristics: optimal substructure (optimal solution contains optimal solutions to subproblems) and overlapping subproblems. Can be implemented top-down (memoization) or bottom-up (tabulation).',
  timeComplexity: 'O(n) for Fibonacci example',
  spaceComplexity: 'O(n)',
  tags: ['optimization', 'memoization', 'recursion', 'subproblems'],
  useCases: ['Optimization problems', 'Counting problems', 'Problems with overlapping subproblems', 'Knapsack problems'],
  relatedProblems: ['LeetCode 70: Climbing Stairs', 'LeetCode 198: House Robber', 'LeetCode 322: Coin Change'],
  dateAdded: '2024-12-28'
};

