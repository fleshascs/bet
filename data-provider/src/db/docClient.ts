import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-west-2',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  endpoint: 'http://localhost:8000'
});

export const docClient = new AWS.DynamoDB.DocumentClient();
