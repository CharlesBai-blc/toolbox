export type CardClassification = 'sorts' | 'searches' | 'algorithms' | 'heuristics' | 'patterns' | 'data-structures';

export type CardDifficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  id: string;
  title: string;
  classification: CardClassification;
  difficulty?: CardDifficulty;
  code: string;
  explanation: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  tags: string[];
  useCases?: string[];
  relatedProblems?: string[];
  dateAdded?: string; // ISO date string for sorting
}

