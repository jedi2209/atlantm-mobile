import * as AWS from 'aws-sdk';
import {AWS_CONFIG} from '../core/const';

const AWSconfiguration = {
  region: AWS_CONFIG.region,
  secretAccessKey: AWS_CONFIG.secretAccessKey,
  accessKeyId: AWS_CONFIG.accessKeyId,
};

const AWSdocClient = new AWS.DynamoDB.DocumentClient(AWSconfiguration);

export const fetchData = tableName => {
  var params = {
    TableName: tableName,
  };

  AWSdocClient.scan(params, function (err, data) {
    if (!err) {
      return data;
    }
    console.error('AWSdocClient.scan error', params, err);
  });
};

export const putData = (tableName, data) => {
  var params = {
    TableName: tableName,
    Item: data,
  };

  AWSdocClient.put(params, (err, data) => {
    if (err) {
      console.error('AWSdocClient.put error', params, err);
    } else {
      console.info('AWSdocClient.put Success', params, data);
    }
  });
};
