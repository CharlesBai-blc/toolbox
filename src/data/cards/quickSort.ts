import type { Card } from '../../types/card';

export const quickSortCard: Card = {
  id: 'quick-sort',
  title: 'Quick Sort',
  classification: 'sorts',
  difficulty: 'medium',
  code: `function quickSort(arr: number[], low: number = 0, high: number = arr.length - 1): void {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  explanation: 'Quick Sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it. Elements smaller than the pivot go to the left, larger to the right. This process is repeated recursively for the sub-arrays. Average case is O(n log n), but worst case can be O(n²) if pivot is always the smallest/largest element.',
  timeComplexity: 'O(n log n) average, O(n²) worst case',
  spaceComplexity: 'O(log n)',
  tags: ['array', 'sort', 'divide-conquer', 'recursion'],
  useCases: ['General-purpose sorting', 'When average performance matters more than worst case', 'In-place sorting'],
  relatedProblems: ['LeetCode 912: Sort an Array', 'LeetCode 75: Sort Colors'],
  dateAdded: '2024-12-28'
};

