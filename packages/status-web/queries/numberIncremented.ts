import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const query = gql`
  subscription {
    numberIncremented
  }
`;

interface BuildOperation {
  query: DocumentNode;
  variables: {
    sportEventId: string;
  };
}

export function buildOperation(): BuildOperation {
  return {
    query,
    variables: {
      sportEventId: '5:4c03d1b7-bbed-4a4c-8944-ee1af6884b3b'
    }
  };
}
