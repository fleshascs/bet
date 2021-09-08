import { authHeaders, token, url } from './config';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink } from 'apollo-link';
import { ClientOptions, SubscriptionClient } from 'subscriptions-transport-ws';
const ws = require('ws');
import { logger } from '../logger';

let link: ApolloLink;
let client: SubscriptionClient;

export function getClient(
  connectionCallback: ClientOptions['connectionCallback'] = defaultCallback
): [ApolloLink, SubscriptionClient] {
  if (!link) {
    client = new SubscriptionClient(
      url,
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
  return [link, client];
}

export function defaultCallback(err, result) {
  if (err) {
    logger.error(err, 'connectionCallback err');
  }
  if (result) {
    logger.info(result, 'connectionCallback result');
  }
}
