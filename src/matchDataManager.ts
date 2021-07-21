import { getSavedMatch, saveMatch } from './dataProvider/utils';
import { Match, MatchUpdates } from './types/ggbetAPI';

export function matchDataManager() {
  const matchStats: Record<Match['slug'], MatchUpdates> = {};
  return {
    loadMatchData: async (match: Match) => {
      const savedMatchStats = await getSavedMatch(match.slug);

      matchStats[match.slug] = {
        match: match,
        onUpdateSportEvent: savedMatchStats?.onUpdateSportEvent ?? []
      };
    },
    onUpdateSportEvent: (match: Match) => {
      matchStats[match.slug].onUpdateSportEvent.push(match);
      saveMatch(match.slug, matchStats[match.slug]);
    },
    findMatchById: (id: Match['slug']) => {
      return Object.values(matchStats).find((m) => m.match.id === id);
    },
    getMatchBySlug: (slug: Match['slug']) => {
      return matchStats[slug];
    }
  };
}
