import { descriptionMap } from '@coinbase/cds-icons/descriptionMap';
import { names } from '@coinbase/cds-icons/names';

const defaultIconSearchLimit = 20;
const maxIconSearchLimit = 100;

type MatchType = 'name' | 'keyword' | 'alias';

export type IconSearchResult = {
  name: string;
  matchedBy: MatchType[];
  matchedKeywords: string[];
  matchedAliases: string[];
};

export type IconSearchResponse = {
  query: string;
  total: number;
  results: IconSearchResult[];
};

type ScoredResult = IconSearchResult & {
  score: number;
};

const iconAliasMap: Record<string, string[]> = {
  crystalBall: ['prediction', 'predictions', 'forecast', 'future'],
};

const keywordEntries = Object.entries(descriptionMap).map(([keyword, iconNames]) => ({
  keyword: keyword.toLowerCase(),
  iconNames,
}));

const clampLimit = (limit?: number) => {
  if (!limit || Number.isNaN(limit)) {
    return defaultIconSearchLimit;
  }

  return Math.min(Math.max(Math.floor(limit), 1), maxIconSearchLimit);
};

const normalizeQuery = (query: string) => query.trim().toLowerCase();

const getAliasMatches = (query: string, iconName: string) => {
  const aliases = iconAliasMap[iconName] ?? [];
  return aliases.filter((alias) => alias.includes(query) || query.includes(alias));
};

const getKeywordMatches = (query: string) => {
  const keywordMatches = new Map<string, string[]>();

  for (const { keyword, iconNames } of keywordEntries) {
    if (!keyword.includes(query)) {
      continue;
    }

    for (const iconName of iconNames) {
      const current = keywordMatches.get(iconName) ?? [];
      current.push(keyword);
      keywordMatches.set(iconName, current);
    }
  }

  return keywordMatches;
};

export const searchIcons = (query: string, limit?: number): IconSearchResponse => {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return { query: normalizedQuery, total: 0, results: [] };
  }

  const keywordMatches = getKeywordMatches(normalizedQuery);
  const scoredResults: ScoredResult[] = [];

  for (const iconName of names) {
    const lowercaseName = iconName.toLowerCase();
    const matchesName = lowercaseName.includes(normalizedQuery);
    const matchedAliases = getAliasMatches(normalizedQuery, iconName);
    const matchedKeywords = keywordMatches.get(iconName) ?? [];

    if (!matchesName && matchedKeywords.length === 0 && matchedAliases.length === 0) {
      continue;
    }

    let score = 0;
    if (lowercaseName === normalizedQuery) {
      score += 100;
    }
    if (lowercaseName.startsWith(normalizedQuery)) {
      score += 50;
    }
    if (matchesName) {
      score += 25;
    }
    if (matchedKeywords.includes(normalizedQuery)) {
      score += 20;
    }
    if (matchedAliases.length > 0) {
      score += 80 + matchedAliases.length * 10;
    }
    score += matchedKeywords.length * 5;

    const matchedBy: MatchType[] = [];
    if (matchesName) {
      matchedBy.push('name');
    }
    if (matchedKeywords.length > 0) {
      matchedBy.push('keyword');
    }
    if (matchedAliases.length > 0) {
      matchedBy.push('alias');
    }

    scoredResults.push({
      name: iconName,
      matchedBy,
      matchedKeywords,
      matchedAliases,
      score,
    });
  }

  scoredResults.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return a.name.localeCompare(b.name);
  });

  const resolvedLimit = clampLimit(limit);
  const results = scoredResults
    .slice(0, resolvedLimit)
    .map(({ score: _score, ...result }) => result);

  return {
    query: normalizedQuery,
    total: scoredResults.length,
    results,
  };
};
