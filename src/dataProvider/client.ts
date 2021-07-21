import { authHeaders, token, uri } from './config';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink } from 'apollo-link';
import { ClientOptions, SubscriptionClient } from 'subscriptions-transport-ws';
const ws = require('ws');

let link: ApolloLink;

export function getClient(connectionCallback: ClientOptions['connectionCallback']): ApolloLink {
  if (!link) {
    const client = new SubscriptionClient(
      uri,
      {
        reconnect: true,
        inactivityTimeout: 0,
        connectionCallback: connectionCallback,
        connectionParams: {
          headers: authHeaders,
          'X-Auth-Token': token
        }
      },
      ws
    );

    link = ApolloLink.from([new WebSocketLink(client)]);
  }
  return link;
}
