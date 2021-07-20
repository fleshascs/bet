import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Match } from '../../types/ggbetAPI';

export const query = gql`
  mutation PlaceBet(
    $type: BetType!
    $odds: [PlaceBetOdd!]!
    $stake: Float!
    $systemSize: [Int!]!
    $freebetId: String
    $stakeMode: StakeMode
  ) {
    bets: placeBet(
      type: $type
      odds: $odds
      stake: $stake
      systemSize: $systemSize
      freebetId: $freebetId
      stakeMode: $stakeMode
    ) {
      ...Bet
    }
  }

  fragment Bet on Bet {
    id
    type
    status
    stake
    stakeInUsd
    refundSum
    refundSumInUsd
    systemSizes
    playerId
    createdAt
    updatedAt
    currencyCode
    cashOutOrders {
      ...CashOutOrders
    }
    declineReason
    odds {
      ...BetOdd
    }
    declineContext {
      ... on BetDeclineContextRestrictions {
        type
        restrictions {
          ...Restriction
        }
      }
    }
  }

  fragment BetOdd on BetOdd {
    sportEventState
    odd {
      ...Odd
    }
    market {
      ...MarketBase
    }
    match: sportEvent {
      ...MatchBase
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

  fragment Restriction on Restriction {
    ...BetIntervalRestriction
    ...BetTypeRestriction
    ...MarketDefectiveRestriction
    ...MarketExistenceRestriction
    ...MarketStatusRestriction
    ...MaxBetRestriction
    ...OddExistenceRestriction
    ...OddStatusRestriction
    ...SelectionValueRestriction
    ...SportEventExistenceRestriction
    ...SportEventStatusRestriction
  }

  fragment BetIntervalRestriction on BetIntervalRestriction {
    type
    sportEventId
    timeToWait
  }

  fragment BetTypeRestriction on BetTypeRestriction {
    type
    sportEventId
    betType
  }

  fragment MarketDefectiveRestriction on MarketDefectiveRestriction {
    type
    sportEventId
    marketId
  }

  fragment MarketExistenceRestriction on MarketExistenceRestriction {
    type
    sportEventId
    marketId
  }

  fragment MarketStatusRestriction on MarketStatusRestriction {
    type
    sportEventId
    marketId
    marketStatus: status
  }

  fragment MaxBetRestriction on MaxBetRestriction {
    type
    maxBet
  }

  fragment OddExistenceRestriction on OddExistenceRestriction {
    type
    sportEventId
    marketId
    oddId
  }

  fragment OddStatusRestriction on OddStatusRestriction {
    type
    sportEventId
    marketId
    oddId
    status
  }

  fragment SelectionValueRestriction on SelectionValueRestriction {
    type
    sportEventId
    marketId
    oddId
    value
  }

  fragment SportEventExistenceRestriction on SportEventExistenceRestriction {
    type
    sportEventId
  }

  fragment SportEventStatusRestriction on SportEventStatusRestriction {
    type
    sportEventId
    sportEventStatus: status
  }

  fragment CashOutOrders on CashOutOrder {
    id
    amount
    betId
    status {
      code
      reason
    }
    selections {
      oddId
      marketId
      sportEventId
      value
    }
    context {
      restrictions {
        ...CashOutRestriction
      }
    }
  }

  fragment CashOutRestriction on CashOutRestriction {
    ...CashOutBetSelectionsMismatchRestriction
    ...CashOutOrderStatusRestriction
    ...CashOutAmountLimitRestriction
    ...BetStatusRestriction
    ...SportEventExistenceRestriction
    ...OddExistenceRestriction
    ...MarketExistenceRestriction
    ...MarketDefectiveRestriction
    ...OddStatusRestriction
    ...SelectionValueRestriction
    ...BaselineSelectionExistenceRestriction
    ...BetProviderRestriction
    ...CashOutUnavailableRestriction
    ...CashOutBetTypeRestriction
    ...CashOutRefundAmountRestriction
  }

  fragment CashOutBetSelectionsMismatchRestriction on CashOutBetSelectionsMismatchRestriction {
    type
    cashOutSelections
    betSelections
  }

  fragment CashOutOrderStatusRestriction on CashOutOrderStatusRestriction {
    type
    cashOutOrderId
    cashOutOrderStatus
  }

  fragment CashOutAmountLimitRestriction on CashOutAmountLimitRestriction {
    type
    cashOutAmount
    cashOutMaxAmount
    cashOutMinAmount
  }

  fragment BetStatusRestriction on BetStatusRestriction {
    type
    betStatus
  }

  fragment BaselineSelectionExistenceRestriction on BaselineSelectionExistenceRestriction {
    type
    marketId
    oddId
    sportEventId
  }

  fragment BetProviderRestriction on BetProviderRestriction {
    type
    betProvider
  }

  fragment CashOutUnavailableRestriction on CashOutUnavailableRestriction {
    type
    reason
  }

  fragment CashOutBetTypeRestriction on CashOutBetTypeRestriction {
    type
    cashOutBetType
  }

  fragment CashOutRefundAmountRestriction on CashOutRefundAmountRestriction {
    type
    cashOutCalculatedRefundAmount
    cashOutRefundAmount
  }
`;

interface BuildOperation {
  query: DocumentNode;
  variables: {
    type: string;
    stake: number;
    odds: {
      matchId: Match['id'];
      marketId: string; // '1'
      oddId: string; // '1'
      ratio: number; // 1.26
    }[];
    systemSize: number[];
  };
}

export function buildOperation(): BuildOperation {
  return {
    query,
    variables: {
      type: 'SINGLE',
      stake: 1,
      odds: [
        {
          matchId: '5:905e4e9e-d5e4-4428-9915-144b94d6112b',
          marketId: '1',
          oddId: '1',
          ratio: 1.26
        }
      ],
      systemSize: [1]
    }
  };
}
