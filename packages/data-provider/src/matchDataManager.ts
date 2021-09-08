import { getSavedMatch, saveMatch } from './dataProvider/utils';
import { Match, MatchUpdates } from './types/ggbetAPI';

interface MatchDataManager {
  loadMatchData: (match: Match) => Promise<void>;
  onUpdateSportEvent: (match: Match) => void;
  findMatchById: (id: Match['id']) => MatchUpdates;
  getMatchById: (id: Match['id']) => MatchUpdates;
}

export function matchDataManager(): MatchDataManager {
  const matchStats: Record<Match['id'], MatchUpdates> = {};
  return {
    loadMatchData: async (match: Match) => {
      const savedMatchStats = await getSavedMatch(match.id);

      matchStats[match.id] = {
        match: match,
        onUpdateSportEvent: savedMatchStats?.onUpdateSportEvent ?? []
      };
    },
    onUpdateSportEvent: (match: Match) => {
      matchStats[match.id].onUpdateSportEvent.push(match);
      saveMatch(match.id, matchStats[match.id]);
    },
    findMatchById: (id: Match['id']) => {
      return Object.values(matchStats).find((m) => m.match.id === id);
    },
    getMatchById: (id: Match['id']) => {
      return matchStats[id];
    }
  };
}
