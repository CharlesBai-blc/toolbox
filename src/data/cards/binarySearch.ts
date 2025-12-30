import type { Card } from '../../types/card';

export const binarySearchCard: Card = {
  id: 'binary-search',
  title: 'Binary Search',
  classification: 'searches',
  difficulty: 'easy',
  code: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
  explanation: 'Binary search is an efficient algorithm for finding an item in a sorted array. It works by repeatedly dividing the search interval in half. If the target value is less than the middle element, search the left half; otherwise, search the right half. This gives us O(log n) time complexity.',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  tags: ['array', 'search', 'divide-conquer', 'sorted'],
  useCases: ['Finding elements in sorted arrays', 'Searching in sorted data structures', 'Optimizing linear search'],
  relatedProblems: ['LeetCode 704: Binary Search', 'LeetCode 35: Search Insert Position', 'LeetCode 278: First Bad Version'],
  dateAdded: '2024-12-28'
};

