import type { Card } from '../../types/card';

export const arrayCard: Card = {
  id: 'array',
  title: 'Array',
  classification: 'data-structures',
  difficulty: 'easy',
  code: `// Array operations and common patterns
class ArrayOperations {
  // Two Sum
  twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      if (map.has(complement)) {
        return [map.get(complement)!, i];
      }
      map.set(nums[i], i);
    }
    return [];
  }

  // Maximum Subarray (Kadane's Algorithm)
  maxSubArray(nums: number[]): number {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
      currentSum = Math.max(nums[i], currentSum + nums[i]);
      maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
  }

  // Rotate Array
  rotate(nums: number[], k: number): void {
    k = k % nums.length;
    const reverse = (start: number, end: number) => {
      while (start < end) {
        [nums[start], nums[end]] = [nums[end], nums[start]];
        start++;
        end--;
      }
    };
    
    reverse(0, nums.length - 1);
    reverse(0, k - 1);
    reverse(k, nums.length - 1);
  }
}`,
  explanation: 'Arrays are the most fundamental data structure. They provide O(1) access by index and are the building block for many algorithms. Common patterns include: two pointers, sliding window, prefix sums, and in-place modifications. Arrays are contiguous in memory, making them cache-friendly and efficient for iteration.',
  timeComplexity: 'Access: O(1), Search: O(n), Insert/Delete: O(n)',
  spaceComplexity: 'O(n)',
  tags: ['array', 'data-structure', 'fundamental', 'two-pointers', 'sliding-window'],
  useCases: ['Storing sequences of data', 'Lookup tables', 'Dynamic programming tables', 'Matrix representations'],
  relatedProblems: ['LeetCode 1: Two Sum', 'LeetCode 53: Maximum Subarray', 'LeetCode 189: Rotate Array', 'LeetCode 238: Product of Array Except Self'],
  dateAdded: '2024-12-28'
};

