import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const query = gql`
  query GetCategorizer(
    $dateFrom: String
    $dateTo: String
    $matchStatuses: [SportEventStatus!]
    $marketStatuses: [MarketStatus!]
    $sportEventTypes: [SportEventType!]
    $sportIds: [String!]
    $providerIds: [Int!]
    $hasStreams: Boolean
  ) {
    categorizer(
      dateFrom: $dateFrom
      dateTo: $dateTo
      matchStatuses: $matchStatuses
      marketStatuses: $marketStatuses
      sportEventTypes: $sportEventTypes
      sportIds: $sportIds
      providerIds: $providerIds
      hasStreams: $hasStreams
    ) {
      field
      value
      name
      count
      meta {
        name
        value
      }
      children {
        field
        value
        name
        count
        meta {
          name
          value
        }
      }
    }
  }
`;

interface BuildOperation {
  query: DocumentNode;
  variables: {
    matchStatuses: string[];
    offset: number;
    limit: number;
    sportEventTypes: string[];
    sportIds: string[];
    tournamentIds: string[];
    marketStatuses: string[];
    providerIds: string[];
  };
}

export function buildOperation(): BuildOperation {
  return {
    query,
    variables: {
      matchStatuses: ['NOT_STARTED', 'SUSPENDED', 'LIVE'],
      offset: 0,
      limit: 20,
      sportEventTypes: ['MATCH'],
      sportIds: [
        'football',
        'basketball',
        'tennis',
        'ice_hockey',
        'volleyball',
        'baseball',
        'beach_volleyball',
        'boxing',
        'futsal',
        'handball',
        'mma',
        'snooker',
        'motorsport',
        'american_football',
        'beach_soccer',
        'esports_call_of_duty',
        'esports_counter_strike',
        'esports_dota_2',
        'esports_hearthstone',
        'esports_heroes_of_the_storm',
        'esports_league_of_legends',
        'esports_overwatch',
        'esports_starcraft',
        'esports_world_of_tanks',
        'esports_street_fighter_5',
        'esports_vainglory',
        'esports_warcraft_3',
        'esports_rainbow_six',
        'esports_rocket_league',
        'esports_smite',
        'esports_soccer_mythical',
        'esports_halo',
        'esports_crossfire',
        'esports_battlegrounds',
        'esports_fifa',
        'esports_starcraft_1',
        'esports_king_of_glory',
        'esports_nba_2k18',
        'australian_rules',
        'chess',
        'darts',
        'rugby_league',
        'rugby',
        'specials',
        'table_tennis',
        'water_polo',
        'esports_fortnite',
        'esports_basketball',
        'esports_valorant',
        'esports_call_of_duty_warzone',
        'cycling',
        'badminton',
        'formula_1',
        'biathlon',
        'bandy',
        'cross_country',
        'ski_jumping',
        'alpine_skiing',
        'curling',
        'esports_apex_legends',
        'esports_artifact',
        'esports_dota_auto_chess',
        'esports_dota_underlords',
        'esports_formula_1',
        'esports_ice_hockey',
        'esports_mortal_kombat',
        'esports_racing',
        'esports_specials',
        'esports_tennis',
        'esports_boxing',
        'esports_volleyball',
        'esports_league_of_legends_wild_rift',
        'basketball_3x3',
        'hockey',
        'olympics',
        'wrestling',
        'rowing',
        'canoe_slalom',
        'canoe_sprint',
        'judo',
        'karate',
        'equestrian',
        'sailing',
        'swimming',
        'diving',
        'trampoline',
        'surfing',
        'synchronized_swimming',
        'skateboarding',
        'modern_pentathlon',
        'softball',
        'artistic_gymnastics',
        'sport_climbing',
        'shooting',
        'archery',
        'triathlon',
        'taekwondo',
        'weightlifting',
        'fencing',
        'rhythmic_gymnastics',
        'basketball_3х3',
        'rugby_sevens',
        'athletics',
        'golf'
      ],
      tournamentIds: [],
      marketStatuses: ['ACTIVE', 'SUSPENDED', 'RESULTED', 'CANCELLED', 'DEACTIVATED'],
      providerIds: []
    }
    // variables: {}, //optional
    // operationName: {}, //optional
    // context: {}, //optional
    // extensions: {} //optional
  };
}

// {
//   "id": "43",
//   "type": "start",
//   "payload": {
//       "variables": {
//           "matchStatuses": [
//               "NOT_STARTED",
//               "SUSPENDED",
//               "LIVE"
//           ],
//           "offset": 0,
//           "limit": 20,
//           "sportEventTypes": [
//               "MATCH"
//           ],
//           "sportIds": [
//               "football",
//               "basketball",
//               "tennis",
//               "ice_hockey",
//               "volleyball",
//               "baseball",
//               "beach_volleyball",
//               "boxing",
//               "futsal",
//               "handball",
//               "mma",
//               "snooker",
//               "motorsport",
//               "american_football",
//               "beach_soccer",
//               "esports_call_of_duty",
//               "esports_counter_strike",
//               "esports_dota_2",
//               "esports_hearthstone",
//               "esports_heroes_of_the_storm",
//               "esports_league_of_legends",
//               "esports_overwatch",
//               "esports_starcraft",
//               "esports_world_of_tanks",
//               "esports_street_fighter_5",
//               "esports_vainglory",
//               "esports_warcraft_3",
//               "esports_rainbow_six",
//               "esports_rocket_league",
//               "esports_smite",
//               "esports_soccer_mythical",
//               "esports_halo",
//               "esports_crossfire",
//               "esports_battlegrounds",
//               "esports_fifa",
//               "esports_starcraft_1",
//               "esports_king_of_glory",
//               "esports_nba_2k18",
//               "australian_rules",
//               "chess",
//               "darts",
//               "rugby_league",
//               "rugby",
//               "specials",
//               "table_tennis",
//               "water_polo",
//               "esports_fortnite",
//               "esports_basketball",
//               "esports_valorant",
//               "esports_call_of_duty_warzone",
//               "cycling",
//               "badminton",
//               "formula_1",
//               "biathlon",
//               "bandy",
//               "cross_country",
//               "ski_jumping",
//               "alpine_skiing",
//               "curling",
//               "esports_apex_legends",
//               "esports_artifact",
//               "esports_dota_auto_chess",
//               "esports_dota_underlords",
//               "esports_formula_1",
//               "esports_ice_hockey",
//               "esports_mortal_kombat",
//               "esports_racing",
//               "esports_specials",
//               "esports_tennis",
//               "esports_boxing",
//               "esports_volleyball",
//               "esports_league_of_legends_wild_rift",
//               "basketball_3x3",
//               "hockey",
//               "olympics",
//               "wrestling",
//               "rowing",
//               "canoe_slalom",
//               "canoe_sprint",
//               "judo",
//               "karate",
//               "equestrian",
//               "sailing",
//               "swimming",
//               "diving",
//               "trampoline",
//               "surfing",
//               "synchronized_swimming",
//               "skateboarding",
//               "modern_pentathlon",
//               "softball",
//               "artistic_gymnastics",
//               "sport_climbing",
//               "shooting",
//               "archery",
//               "triathlon",
//               "taekwondo",
//               "weightlifting",
//               "fencing",
//               "rhythmic_gymnastics",
//               "basketball_3х3",
//               "rugby_sevens",
//               "athletics",
//               "golf"
//           ],
//           "tournamentIds": [],
//           "marketStatuses": [
//               "ACTIVE",
//               "SUSPENDED",
//               "RESULTED",
//               "CANCELLED",
//               "DEACTIVATED"
//           ],
//           "providerIds": []
//       },
//       "extensions": {},
//       "operationName": "GetCategorizer",
//       "query": "query GetCategorizer($dateFrom: String, $dateTo: String, $matchStatuses: [SportEventStatus!], $marketStatuses: [MarketStatus!], $sportEventTypes: [SportEventType!], $sportIds: [String!], $providerIds: [Int!], $hasStreams: Boolean) {\n  categorizer(dateFrom: $dateFrom, dateTo: $dateTo, matchStatuses: $matchStatuses, marketStatuses: $marketStatuses, sportEventTypes: $sportEventTypes, sportIds: $sportIds, providerIds: $providerIds, hasStreams: $hasStreams) {\n    field\n    value\n    name\n    count\n    meta {\n      name\n      value\n    }\n    children {\n      field\n      value\n      name\n      count\n      meta {\n        name\n        value\n      }\n    }\n  }\n}\n"
//   }
// }
