import { createServer } from 'http';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { ApolloServer, gql } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import next from 'next';

(async () => {
  const PORT = 3000;
  const pubsub = new PubSub();
  const expressApp = express();
  const httpServer = createServer(expressApp);

  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });
  const handle = app.getRequestHandler();

  // Schema definition
  const typeDefs = gql`
    type Query {
      currentNumber: Int
    }

    type Subscription {
      numberIncremented: Int
    }
  `;

  // Resolver map
  const resolvers = {
    Query: {
      currentNumber() {
        return currentNumber;
      }
    },
    Subscription: {
      numberIncremented: {
        subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED'])
      }
    }
  };

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema
  });
  await server.start();
  server.applyMiddleware({ app: expressApp });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );
  app.prepare().then(() => {
    expressApp.all('*', (req, res) => {
      return handle(req, res);
    });

    httpServer.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`);
      // eslint-disable-next-line no-console
      console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`);
    });
  });

  let currentNumber = 0;
  function incrementNumber() {
    currentNumber++;
    pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });
    setTimeout(incrementNumber, 1000);
  }
  // Start incrementing
  incrementNumber();
})();
