import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink } from 'apollo-link';
import { ClientOptions, SubscriptionClient } from 'subscriptions-transport-ws';

let link: ApolloLink;
let client: SubscriptionClient;

export function getClient(
  connectionCallback: ClientOptions['connectionCallback'] = defaultCallback
): [ApolloLink, SubscriptionClient] {
  if (!link) {
    client = new SubscriptionClient(
      'ws://localhost:3000/graphql',
      {
        reconnect: true,
        inactivityTimeout: 0,
        connectionCallback: connectionCallback
        // connectionParams: {
        //   headers: authHeaders,
        //   'X-Auth-Token': token
        // }
      }
      // ws
    );

    link = ApolloLink.from([new WebSocketLink(client)]);
  }
  return [link, client];
}

export function defaultCallback(err: Error[]): void {
  if (err) {
    console.error(err, 'connectionCallback err');
  }
}
