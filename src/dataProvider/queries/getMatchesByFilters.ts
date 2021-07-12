import gql from 'graphql-tag';

export const query = gql`
  query GetMatchesByFilters(
    $offset: Int!
    $limit: Int!
    $search: String
    $dateFrom: String
    $dateTo: String
    $providerIds: [Int!]
    $matchStatuses: [SportEventStatus!]
    $sportIds: [String!]
    $tournamentIds: [String!]
    $competitorIds: [String!]
    $marketStatusesForSportEvent: [MarketStatus!]
    $marketStatuses: [MarketStatus!]
    $marketLimit: Int = 1
    $isTopMarkets: Boolean = false
    $dateSortAscending: Boolean
    $sportEventTypes: [SportEventType!]
    $withMarketsCount: Boolean = true
    $marketTypes: [Int!]
    $favorite: Boolean = false
    $hasStreams: Boolean
    $order: SportEventOrder
  ) {
    matches: sportEventsByFilters(
      offset: $offset
      limit: $limit
      searchString: $search
      dateFrom: $dateFrom
      dateTo: $dateTo
      providerIds: $providerIds
      matchStatuses: $matchStatuses
      sportIds: $sportIds
      tournamentIds: $tournamentIds
      competitorIds: $competitorIds
      marketStatuses: $marketStatusesForSportEvent
      sportEventTypes: $sportEventTypes
      dateSortAscending: $dateSortAscending
      marketTypes: $marketTypes
      favorite: $favorite
      hasStreams: $hasStreams
      order: $order
    ) {
      ...Match
      marketsCount(statuses: $marketStatuses) @include(if: $withMarketsCount)
    }
  }

  fragment Match on SportEvent {
    ...MatchBase
    markets(top: $isTopMarkets, limit: $marketLimit, statuses: $marketStatuses) {
      ...Market
    }
  }

  fragment MatchBase on SportEvent {
    id
    disabled
    providerId
    hasMatchLog
    slug
    meta {
      name
      value
    }
    fixture {
      ...MatchFixture
    }
  }

  fragment MatchFixture on SportEventFixture {
    score
    title
    status
    type
    startTime
    sportId
    liveCoverage
    streams {
      id
      locale
      url
      platforms {
        type
        enabled
      }
    }
    tournament {
      ...MatchTournament
    }
    competitors {
      id: masterId
      name
      type
      homeAway
      logo
      templatePosition
      score {
        id
        type
        points
        number
      }
    }
  }

  fragment MatchTournament on Tournament {
    id
    name
    masterId
    countryCode
    logo
    description
    showTournamentInfo
    prizePool
    dateStart
    dateEnd
    isLocalizationOverridden
    slug
    sportId
  }

  fragment Market on Market {
    ...MarketBase
    odds {
      ...Odd
    }
  }

  fragment MarketBase on Market {
    id
    name
    status
    typeId
    priority
    tags
    specifiers {
      name
      value
    }
  }

  fragment Odd on Odd {
    id
    name
    value
    isActive
    status
    competitorId
  }
`;

export function buildOperation() {
  return {
    query,
    variables: {
      offset: 0,
      limit: 20,
      matchStatuses: ['NOT_STARTED', 'SUSPENDED', 'LIVE'],
      marketStatuses: ['ACTIVE', 'SUSPENDED'],
      sportEventTypes: ['MATCH'],
      sportIds: ['esports_counter_strike'],
      tournamentIds: [],
      marketStatusesForSportEvent: ['ACTIVE', 'SUSPENDED', 'RESULTED', 'CANCELLED', 'DEACTIVATED'],
      marketLimit: 3,
      isTopMarkets: true,
      order: 'RANK',
      providerIds: []
    }
  };
}
