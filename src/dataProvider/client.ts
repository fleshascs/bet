import { authHeaders, token, uri } from './config';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink } from 'apollo-link';
import { SubscriptionClient } from 'subscriptions-transport-ws';
const ws = require('ws');

let link: ApolloLink;

export function getClient() {
  if (!link) {
    const client = new SubscriptionClient(
      uri,
      {
        reconnect: true,
        connectionCallback: function (err) {
          console.log(new Date().toLocaleString() + ' connectionCallback', err);
        },
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
