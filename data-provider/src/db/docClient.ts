import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
});

export const docClient = new AWS.DynamoDB.DocumentClient();
