import type { Card } from '../../types/card';

export const slidingWindowCard: Card = {
  id: 'sliding-window',
  title: 'Sliding Window',
  classification: 'patterns',
  difficulty: 'medium',
  code: `// Maximum sum of subarray of size k
function maxSumSubarray(arr: number[], k: number): number {
  let windowSum = 0;
  let maxSum = 0;
  
  // Calculate sum of first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}`,
  explanation: 'The sliding window technique maintains a window of elements and slides it across the data structure. Instead of recalculating everything, we update the window by removing the leftmost element and adding the rightmost. This is efficient for problems involving contiguous subarrays or substrings. Reduces time complexity from O(n²) to O(n) in many cases.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  tags: ['array', 'string', 'optimization', 'subarray'],
  useCases: ['Maximum/minimum in subarrays', 'Longest substring problems', 'Anagram finding', 'Subarray sum problems'],
  relatedProblems: ['LeetCode 209: Minimum Size Subarray Sum', 'LeetCode 3: Longest Substring Without Repeating Characters', 'LeetCode 438: Find All Anagrams in a String'],
  dateAdded: '2024-12-28'
};

