import gql from 'graphql-tag';

export const query = gql`
  subscription OnUpdateSportEvent(
    $sportEventId: String!
    $isTopMarkets: Boolean = false
    $marketLimit: Int
    $marketIds: [String!]
    $marketStatuses: [MarketStatus!]
    $marketsCountStatuses: [MarketStatus!] = [ACTIVE, SUSPENDED]
    $withMarketsCount: Boolean = true
  ) {
    onUpdateSportEvent(
      sportEventId: $sportEventId
      marketIds: $marketIds
      marketStatuses: $marketStatuses
    ) {
      id
      slug
      disabled
      marketsCount(statuses: $marketsCountStatuses) @include(if: $withMarketsCount)
      markets(top: $isTopMarkets, limit: $marketLimit, statuses: $marketStatuses) {
        ...Market
      }
      meta {
        name
        value
      }
      fixture {
        score
        status
        competitors {
          id: masterId
          score {
            id
            type
            points
            number
          }
        }
        streams {
          id
          locale
          url
          priority
          platforms {
            type
            allowedCountries
            enabled
          }
        }
      }
    }
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

export function buildOperation(sportEventId: string) {
  return {
    query,
    variables: {
      sportEventId, //'5:4c03d1b7-bbed-4a4c-8944-ee1af6884b3b',
      marketIds: ['1'],
      isTopMarkets: false,
      withMarketsCount: false
    }
  };
}
