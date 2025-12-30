import type { Card } from '../../types/card';

export const linkedListCard: Card = {
  id: 'linked-list',
  title: 'Linked List',
  classification: 'data-structures',
  difficulty: 'medium',
  code: `// Linked List implementation
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

class LinkedListOperations {
  // Reverse Linked List
  reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let current = head;
    
    while (current !== null) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    
    return prev;
  }

  // Detect Cycle (Floyd's Cycle Detection)
  hasCycle(head: ListNode | null): boolean {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head.next;
    
    while (slow !== fast) {
      if (!fast || !fast.next) return false;
      slow = slow.next!;
      fast = fast.next.next!;
    }
    
    return true;
  }

  // Merge Two Sorted Lists
  mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    const dummy = new ListNode();
    let current = dummy;
    
    while (list1 && list2) {
      if (list1.val < list2.val) {
        current.next = list1;
        list1 = list1.next;
      } else {
        current.next = list2;
        list2 = list2.next;
      }
      current = current.next;
    }
    
    current.next = list1 || list2;
    return dummy.next;
  }
}`,
  explanation: 'Linked lists are linear data structures where elements are connected via pointers. Unlike arrays, they don\'t require contiguous memory. Key advantages: O(1) insertion/deletion at head, dynamic size. Disadvantages: O(n) access by index, extra memory for pointers. Common patterns: two pointers (fast/slow), dummy nodes, and pointer manipulation.',
  timeComplexity: 'Access: O(n), Insert/Delete at head: O(1), Insert/Delete at position: O(n)',
  spaceComplexity: 'O(n)',
  tags: ['linked-list', 'data-structure', 'pointers', 'two-pointers'],
  useCases: ['When frequent insertions/deletions at beginning', 'Implementing stacks and queues', 'Memory-efficient alternative to arrays', 'Circular buffers'],
  relatedProblems: ['LeetCode 206: Reverse Linked List', 'LeetCode 141: Linked List Cycle', 'LeetCode 21: Merge Two Sorted Lists', 'LeetCode 19: Remove Nth Node From End'],
  dateAdded: '2024-12-28'
};

