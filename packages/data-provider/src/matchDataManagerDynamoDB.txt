import { Match, MatchUpdates } from './types/ggbetAPI';
import { put, query } from './db';

interface MatchDataManager {
  loadMatchData: (match: Match) => Promise<void>;
  onUpdateSportEvent: (match: Match) => void;
  findMatchById: (id: Match['id']) => MatchUpdates;
  getMatchById: (id: Match['id']) => MatchUpdates;
}

// var params = {
//   TableName: 'basicSongsTable',
//   Item: {
//     artist: song.artist,
//     song: song.song,
//     id: song.id,
//     priceUsdCents: song.priceUsdCents,
//     publisher: song.publisher
//   }
// };

// docClient.put(params, function(err, data) {
//   if (err) {
//     console.error("Can't add song. Darn. Well I guess Fernando needs to write better scripts.");
//   } else {
//     console.log("Succeeded adding an item for this song: ", song.song);
//   }
// });

export function matchDataManager(): MatchDataManager {
  // const matchStats: Record<Match['id'], MatchUpdates> = {};
  return {
    loadMatchData: async (match: Match) => {
      const result = await query({
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: match.id }
        },
        TableName: 'matches'
      });

      if (!result.Items) {
        put({
          TableName: 'matches',
          Item: match
        });
      }
    },
    onUpdateSportEvent: (match: Match) => {
      put({
        TableName: 'matchUpdates',
        Item: match
      });
    },
    findMatchById: (id: Match['id']) => {
      return query({
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: id }
        },
        TableName: 'matches'
      });
      //  return Object.values(matchStats).find((m) => m.match.id === id);
    },
    getMatchById: (id: Match['id']) => {
      return query({
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: id }
        },
        TableName: 'matches'
      });
      // return matchStats[id];
    }
  };
}
