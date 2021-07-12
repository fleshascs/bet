export interface MetaItem {
  name: string;
  value: string;
}

export interface Score {
  id: string;
  type: 'map' | 'total' | 'round_overtime';
  points: string; // "5"
  number: number;
}

type CompetitorId = string;

export interface Competitor {
  id: CompetitorId;
  name: string;
  type: 'TEAM';
  homeAway: 'HOME';
  logo: string;
  templatePosition: number;
  score: Score[];
}

export interface Fixture {
  title: string;
  status: 'LIVE' | 'NOT_STARTED';
  type: string;
  startTime: string;
  sportId: string;
  liveCoverage: boolean;
  streams: any[];
  tournament: any;
  competitors: Competitor[];
}

export interface Match {
  id: string;
  disabled: boolean;
  providerId: number;
  hasMatchLog: boolean;
  slug: string;
  meta: MetaItem[];
  fixture: Fixture;
  markets: Market[];
}

export interface Market {
  id: number;
  name: string;
  status: 'ACTIVE' | 'RESULTED';
  typeId: number;
  priority: number;
  tags: string[];
  specifiers: string[];
  odds: Odd[];
}

export interface Odd {
  id: number;
  name: string;
  value: number;
  isActive: true;
  status: 'NOT_RESULTED' | 'WIN' | 'LOSS';
  competitorId: CompetitorId;
}

export interface OnUpdateSportEvent {
  data: {
    onUpdateSportEvent: Match;
  };
}
export interface GetMatchesByFilters {
  data: {
    matches: Match[];
  };
}

export interface MatchUpdates {
  onUpdateSportEvent: Match[];
  match: Match;
}
