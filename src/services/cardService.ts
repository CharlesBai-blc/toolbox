import { supabase } from '../lib/supabase';
import type {
  Card,
  CardImplementation,
  CardImplementationInput,
  CardInput,
} from '../types/card';

interface DatabaseImplementation {
  id: string;
  card_id: string;
  language: string;
  code: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseCard {
  id: string;
  title: string;
  classification: string;
  difficulty: string | null;
  explanation: string;
  time_complexity: string | null;
  space_complexity: string | null;
  methods: { name: string; time_complexity: string }[] | null;
  tags: string[];
  use_cases: string[] | null;
  related_problems: string[] | null;
  date_added: string | null;
  created_at: string;
  updated_at: string;
  card_implementations?: DatabaseImplementation[];
}

function dbToImplementation(
  implementation: DatabaseImplementation,
): CardImplementation {
  return {
    id: implementation.id,
    cardId: implementation.card_id,
    language: implementation.language as CardImplementation['language'],
    code: implementation.code,
    createdAt: implementation.created_at,
    updatedAt: implementation.updated_at,
  };
}

function dbToCard(dbCard: DatabaseCard): Card {
  const implementations = (dbCard.card_implementations || [])
    .map(dbToImplementation)
    .sort((a, b) => {
      if (a.language === 'python') return -1;
      if (b.language === 'python') return 1;
      return a.language.localeCompare(b.language);
    });

  return {
    id: dbCard.id,
    title: dbCard.title,
    classification: dbCard.classification as Card['classification'],
    difficulty: (dbCard.difficulty as Card['difficulty']) || undefined,
    explanation: dbCard.explanation,
    timeComplexity: dbCard.time_complexity || undefined,
    spaceComplexity: dbCard.space_complexity || undefined,
    methods: dbCard.methods
      ? dbCard.methods.map(method => ({
          name: method.name,
          timeComplexity: method.time_complexity,
        }))
      : undefined,
    tags: dbCard.tags,
    useCases: dbCard.use_cases || undefined,
    relatedProblems: dbCard.related_problems || undefined,
    dateAdded: dbCard.date_added || undefined,
    implementations,
  };
}

function cardToRpcArguments(
  card: CardInput,
  implementations: CardImplementationInput[],
) {
  return {
    p_title: card.title,
    p_classification: card.classification,
    p_difficulty: card.difficulty || null,
    p_explanation: card.explanation,
    p_time_complexity: card.timeComplexity || null,
    p_space_complexity: card.spaceComplexity || null,
    p_methods: card.methods
      ? card.methods.map(method => ({
          name: method.name,
          time_complexity: method.timeComplexity,
        }))
      : null,
    p_tags: card.tags,
    p_use_cases: card.useCases || null,
    p_related_problems: card.relatedProblems || null,
    p_implementations: implementations,
  };
}

export async function getAllCards(): Promise<Card[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*, card_implementations(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cards:', error);
    throw new Error(`Failed to fetch cards: ${error.message}`);
  }

  return ((data || []) as DatabaseCard[]).map(dbToCard);
}

export async function createCard(
  card: CardInput,
  implementations: CardImplementationInput[],
): Promise<void> {
  if (implementations.length === 0) {
    throw new Error('A card requires at least one implementation.');
  }

  const { error } = await supabase.rpc(
    'create_card_with_implementations',
    cardToRpcArguments(card, implementations),
  );

  if (error) {
    console.error('Error creating card atomically:', error);
    throw new Error(`Failed to create card: ${error.message}`);
  }
}

export async function updateCard(
  id: string,
  card: CardInput,
  implementations: CardImplementationInput[],
): Promise<void> {
  if (implementations.length === 0) {
    throw new Error('A card requires at least one implementation.');
  }

  const { error } = await supabase.rpc('update_card_with_implementations', {
    p_card_id: id,
    ...cardToRpcArguments(card, implementations),
  });

  if (error) {
    console.error('Error updating card atomically:', error);
    throw new Error(`Failed to update card: ${error.message}`);
  }
}

export async function deleteCard(id: string): Promise<void> {
  const { error } = await supabase.from('cards').delete().eq('id', id);

  if (error) {
    console.error('Error deleting card:', error);
    throw new Error(`Failed to delete card: ${error.message}`);
  }
}

export async function createCardImplementation(
  cardId: string,
  implementation: CardImplementationInput,
): Promise<CardImplementation> {
  const { data, error } = await supabase
    .from('card_implementations')
    .insert({
      card_id: cardId,
      language: implementation.language,
      code: implementation.code,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating card implementation:', error);
    throw new Error(`Failed to add implementation: ${error.message}`);
  }

  return dbToImplementation(data as DatabaseImplementation);
}

export async function updateCardImplementation(
  id: string,
  implementation: CardImplementationInput,
): Promise<CardImplementation> {
  const { data, error } = await supabase
    .from('card_implementations')
    .update({
      language: implementation.language,
      code: implementation.code,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating card implementation:', error);
    throw new Error(`Failed to update implementation: ${error.message}`);
  }

  return dbToImplementation(data as DatabaseImplementation);
}

export async function deleteCardImplementation(
  id: string,
  cardId: string,
): Promise<void> {
  const { count, error: countError } = await supabase
    .from('card_implementations')
    .select('id', { count: 'exact', head: true })
    .eq('card_id', cardId);

  if (countError) {
    throw new Error(`Failed to verify implementations: ${countError.message}`);
  }

  if ((count || 0) <= 1) {
    throw new Error('Every card must keep at least one implementation.');
  }

  const { error } = await supabase
    .from('card_implementations')
    .delete()
    .eq('id', id)
    .eq('card_id', cardId);

  if (error) {
    console.error('Error deleting card implementation:', error);
    throw new Error(`Failed to delete implementation: ${error.message}`);
  }
}
