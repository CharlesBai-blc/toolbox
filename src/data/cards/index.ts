import { binarySearchCard } from './binarySearch';
import { quickSortCard } from './quickSort';
import { twoPointersCard } from './twoPointers';
import { dynamicProgrammingCard } from './dynamicProgramming';
import { slidingWindowCard } from './slidingWindow';
import { arrayCard } from './array';
import { linkedListCard } from './linkedList';
import { treeCard } from './tree';
import { graphCard } from './graph';
import type { Card } from '../../types/card';

// Export all cards as an array for easy iteration
export const allCards: Card[] = [
  binarySearchCard,
  quickSortCard,
  twoPointersCard,
  dynamicProgrammingCard,
  slidingWindowCard,
  arrayCard,
  linkedListCard,
  treeCard,
  graphCard
];

// Export individual cards for direct imports if needed
export {
  binarySearchCard,
  quickSortCard,
  twoPointersCard,
  dynamicProgrammingCard,
  slidingWindowCard,
  arrayCard,
  linkedListCard,
  treeCard,
  graphCard
};

