import type { Card } from '../../types/card';

export const treeCard: Card = {
  id: 'tree',
  title: 'Tree',
  classification: 'data-structures',
  difficulty: 'medium',
  code: `// Binary Tree implementation and traversals
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

class TreeOperations {
  // Inorder Traversal (Left, Root, Right)
  inorderTraversal(root: TreeNode | null): number[] {
    const result: number[] = [];
    
    const inorder = (node: TreeNode | null) => {
      if (!node) return;
      inorder(node.left);
      result.push(node.val);
      inorder(node.right);
    };
    
    inorder(root);
    return result;
  }

  // Maximum Depth
  maxDepth(root: TreeNode | null): number {
    if (!root) return 0;
    return 1 + Math.max(this.maxDepth(root.left), this.maxDepth(root.right));
  }

  // Validate Binary Search Tree
  isValidBST(root: TreeNode | null): boolean {
    const validate = (node: TreeNode | null, min: number, max: number): boolean => {
      if (!node) return true;
      if (node.val <= min || node.val >= max) return false;
      return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    };
    
    return validate(root, -Infinity, Infinity);
  }

  // Level Order Traversal (BFS)
  levelOrder(root: TreeNode | null): number[][] {
    if (!root) return [];
    
    const result: number[][] = [];
    const queue: TreeNode[] = [root];
    
    while (queue.length > 0) {
      const level: number[] = [];
      const size = queue.length;
      
      for (let i = 0; i < size; i++) {
        const node = queue.shift()!;
        level.push(node.val);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      
      result.push(level);
    }
    
    return result;
  }
}`,
  explanation: 'Trees are hierarchical data structures with a root node and child nodes. Binary trees have at most two children per node. Key concepts: depth (distance from root), height (longest path to leaf), and traversals (inorder, preorder, postorder, level-order). Binary Search Trees (BST) maintain ordering: left < root < right, enabling O(log n) search operations.',
  timeComplexity: 'Search (BST): O(log n) average, O(n) worst, Traversal: O(n)',
  spaceComplexity: 'O(n) for storage, O(h) for recursion where h is height',
  tags: ['tree', 'binary-tree', 'bst', 'data-structure', 'dfs', 'bfs', 'recursion'],
  useCases: ['Hierarchical data representation', 'Search operations (BST)', 'Expression parsing', 'Decision trees', 'File systems'],
  relatedProblems: ['LeetCode 94: Binary Tree Inorder Traversal', 'LeetCode 104: Maximum Depth of Binary Tree', 'LeetCode 98: Validate Binary Search Tree', 'LeetCode 102: Binary Tree Level Order Traversal'],
  dateAdded: '2024-12-28'
};

