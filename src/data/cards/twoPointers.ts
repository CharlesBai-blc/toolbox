import type { Card } from '../../types/card';

export const twoPointersCard: Card = {
  id: 'two-pointers',
  title: 'Two Pointers',
  classification: 'heuristics',
  difficulty: 'easy',
  code: `function twoSumSorted(arr: number[], target: number): number[] {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [];
}`,
  explanation: 'The two pointers technique uses two pointers that traverse the data structure from different positions. Common patterns include: starting from both ends and moving inward, or both starting from the beginning with one moving faster. This is especially useful for sorted arrays and can reduce time complexity from O(n²) to O(n).',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  tags: ['array', 'two-pointers', 'optimization'],
  useCases: ['Finding pairs in sorted arrays', 'Palindrome checking', 'Removing duplicates', 'Merging sorted arrays'],
  relatedProblems: ['LeetCode 167: Two Sum II', 'LeetCode 125: Valid Palindrome', 'LeetCode 283: Move Zeroes'],
  dateAdded: '2024-12-28'
};

