import gql from 'graphql-tag';

export const query = gql`
  query GetMatchBySlug(
    $slug: String!
    $marketStatuses: [MarketStatus!]
    $marketTypes: [Int!]
    $marketLimit: Int = 9999
    $isTopMarkets: Boolean = false
  ) {
    match: sportEventBySlug(
      slug: $slug
      marketTypes: $marketTypes
      marketLimit: $marketLimit
      marketStatuses: $marketStatuses
    ) {
      ...Match
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

export function buildOperation(slug: string) {
  return {
    query,
    variables: {
      // slug: 'forze-vs-nemiga-15-06',
      slug, //: 'natus-vincere-vs-faze-16-06',
      marketStatuses: ['RESULTED'] //   marketStatuses: ['ACTIVE', 'SUSPENDED']
    }
    // variables: {}, //optional
    // operationName: {}, //optional
    // context: {}, //optional
    // extensions: {} //optional
  };
}
