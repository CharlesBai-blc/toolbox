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

type DatabaseCardInsert = Omit<
  DatabaseCard,
  'id' | 'created_at' | 'updated_at' | 'card_implementations'
>;

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

function cardToDb(card: CardInput): DatabaseCardInsert {
  return {
    title: card.title,
    classification: card.classification,
    difficulty: card.difficulty || null,
    explanation: card.explanation,
    time_complexity: card.timeComplexity || null,
    space_complexity: card.spaceComplexity || null,
    methods: card.methods
      ? card.methods.map(method => ({
          name: method.name,
          time_complexity: method.timeComplexity,
        }))
      : null,
    tags: card.tags,
    use_cases: card.useCases || null,
    related_problems: card.relatedProblems || null,
    date_added: null,
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
  initialImplementation: CardImplementationInput,
): Promise<Card> {
  const { data: createdCard, error: cardError } = await supabase
    .from('cards')
    .insert(cardToDb(card))
    .select('*')
    .single();

  if (cardError) {
    console.error('Error creating card:', cardError);
    throw new Error(`Failed to create card: ${cardError.message}`);
  }

  const { data: implementation, error: implementationError } = await supabase
    .from('card_implementations')
    .insert({
      card_id: createdCard.id,
      language: initialImplementation.language,
      code: initialImplementation.code,
    })
    .select()
    .single();

  if (implementationError) {
    await supabase.from('cards').delete().eq('id', createdCard.id);
    console.error('Error creating initial implementation:', implementationError);
    throw new Error(
      `Failed to create card implementation: ${implementationError.message}`,
    );
  }

  return dbToCard({
    ...(createdCard as DatabaseCard),
    card_implementations: [implementation as DatabaseImplementation],
  });
}

export async function updateCard(
  id: string,
  updates: Partial<CardInput>,
): Promise<Card> {
  const updateData: Partial<DatabaseCardInsert> = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.classification !== undefined) {
    updateData.classification = updates.classification;
  }
  if ('difficulty' in updates) {
    updateData.difficulty = updates.difficulty || null;
  }
  if (updates.explanation !== undefined) {
    updateData.explanation = updates.explanation;
  }
  if ('timeComplexity' in updates) {
    updateData.time_complexity = updates.timeComplexity || null;
  }
  if ('spaceComplexity' in updates) {
    updateData.space_complexity = updates.spaceComplexity || null;
  }
  if ('methods' in updates) {
    updateData.methods = updates.methods
      ? updates.methods.map(method => ({
          name: method.name,
          time_complexity: method.timeComplexity,
        }))
      : null;
  }
  if (updates.tags !== undefined) updateData.tags = updates.tags;
  if ('useCases' in updates) {
    updateData.use_cases = updates.useCases || null;
  }
  if ('relatedProblems' in updates) {
    updateData.related_problems = updates.relatedProblems || null;
  }

  const { data, error } = await supabase
    .from('cards')
    .update(updateData)
    .eq('id', id)
    .select('*, card_implementations(*)')
    .single();

  if (error) {
    console.error('Error updating card:', error);
    throw new Error(`Failed to update card: ${error.message}`);
  }

  return dbToCard(data as DatabaseCard);
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
