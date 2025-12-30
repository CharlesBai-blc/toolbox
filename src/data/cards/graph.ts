import type { Card } from '../../types/card';

export const graphCard: Card = {
  id: 'graph',
  title: 'Graph',
  classification: 'data-structures',
  difficulty: 'hard',
  code: `// Graph representation and traversal
// Adjacency List representation
class Graph {
  private adjacencyList: Map<number, number[]>;
  
  constructor() {
    this.adjacencyList = new Map();
  }
  
  addVertex(vertex: number): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }
  
  addEdge(vertex1: number, vertex2: number): void {
    this.addVertex(vertex1);
    this.addVertex(vertex2);
    this.adjacencyList.get(vertex1)!.push(vertex2);
    this.adjacencyList.get(vertex2)!.push(vertex1); // For undirected graph
  }

  // Depth-First Search (DFS)
  dfs(start: number): number[] {
    const result: number[] = [];
    const visited = new Set<number>();
    
    const dfsHelper = (vertex: number) => {
      visited.add(vertex);
      result.push(vertex);
      
      const neighbors = this.adjacencyList.get(vertex) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    };
    
    dfsHelper(start);
    return result;
  }

  // Breadth-First Search (BFS)
  bfs(start: number): number[] {
    const result: number[] = [];
    const visited = new Set<number>();
    const queue: number[] = [start];
    visited.add(start);
    
    while (queue.length > 0) {
      const vertex = queue.shift()!;
      result.push(vertex);
      
      const neighbors = this.adjacencyList.get(vertex) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    return result;
  }

  // Detect Cycle in Undirected Graph
  hasCycle(): boolean {
    const visited = new Set<number>();
    
    const hasCycleHelper = (vertex: number, parent: number | null): boolean => {
      visited.add(vertex);
      const neighbors = this.adjacencyList.get(vertex) || [];
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycleHelper(neighbor, vertex)) return true;
        } else if (neighbor !== parent) {
          return true;
        }
      }
      
      return false;
    };
    
    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        if (hasCycleHelper(vertex, null)) return true;
      }
    }
    
    return false;
  }
}`,
  explanation: 'Graphs represent relationships between entities. Consist of vertices (nodes) and edges (connections). Can be directed or undirected, weighted or unweighted. Common representations: adjacency list (space-efficient, good for sparse graphs) and adjacency matrix (fast lookups, good for dense graphs). Key algorithms: DFS (depth-first) for exploring paths, BFS (breadth-first) for shortest paths in unweighted graphs.',
  timeComplexity: 'DFS/BFS: O(V + E) where V is vertices, E is edges',
  spaceComplexity: 'O(V + E) for adjacency list, O(V²) for adjacency matrix',
  tags: ['graph', 'data-structure', 'dfs', 'bfs', 'traversal', 'cycle-detection'],
  useCases: ['Social networks', 'Web page links', 'Route planning', 'Dependency resolution', 'Network analysis'],
  relatedProblems: ['LeetCode 200: Number of Islands', 'LeetCode 207: Course Schedule', 'LeetCode 133: Clone Graph', 'LeetCode 127: Word Ladder'],
  dateAdded: '2024-12-28'
};

