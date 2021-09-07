import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { docClient } from './docClient';

export function put(
  params: DocumentClient.PutItemInput
): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
  return docClient.put(params).promise();
}

export function query(
  params: DocumentClient.QueryInput
): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
  return docClient.query(params).promise();
}
