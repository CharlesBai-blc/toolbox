import type { CardClassification, CardDifficulty, CardLanguage } from '../types/card';

/**
 * All available card classifications
 */
export const CLASSIFICATIONS: readonly CardClassification[] = [
  'sorts',
  'searches',
  'algorithms',
  'heuristics',
  'patterns',
  'data-structures',
] as const;

/**
 * All available difficulty levels
 */
export const DIFFICULTIES: readonly CardDifficulty[] = ['easy', 'medium', 'hard'] as const;

/**
 * All supported programming languages
 */
export const LANGUAGES: readonly CardLanguage[] = [
  'python',
  'javascript',
  'java',
  'cpp',
  'c',
  'go',
  'rust',
  'csharp',
  'typescript',
  'ruby',
  'php',
  'erlang',
  'kotlin',
] as const;

/**
 * Difficulty color mapping
 */
export const DIFFICULTY_COLORS: Record<CardDifficulty, string> = {
  easy: '#3eb870',
  medium: '#c99a1c',
  hard: '#c65a5a',
} as const;

/**
 * Default difficulty color for undefined/null values
 */
export const DEFAULT_DIFFICULTY_COLOR = '#6b7280';

/**
 * Formats a classification name for display
 * @param classification - The classification to format
 * @returns Formatted classification string
 */
export function formatClassification(classification: CardClassification): string {
  if (classification === 'data-structures') {
    return 'Data Structures';
  }
  return classification.charAt(0).toUpperCase() + classification.slice(1);
}

/**
 * Gets the color for a difficulty level
 * @param difficulty - The difficulty level (optional)
 * @returns Hex color code
 */
export function getDifficultyColor(difficulty?: CardDifficulty): string {
  if (!difficulty) {
    return DEFAULT_DIFFICULTY_COLOR;
  }
  return DIFFICULTY_COLORS[difficulty] || DEFAULT_DIFFICULTY_COLOR;
}

/**
 * Formats a language name for display
 * @param language - The language code
 * @returns Formatted language name
 */
export function formatLanguage(language: CardLanguage): string {
  const languageMap: Record<CardLanguage, string> = {
    python: 'Python',
    javascript: 'JavaScript',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    go: 'Go',
    rust: 'Rust',
    csharp: 'C#',
    typescript: 'TypeScript',
    ruby: 'Ruby',
    php: 'PHP',
    erlang: 'Erlang',
    kotlin: 'Kotlin',
  };
  return languageMap[language] || language.charAt(0).toUpperCase() + language.slice(1);
}
