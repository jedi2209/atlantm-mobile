import * as AWS from 'aws-sdk'
import {AWS_CONFIG} from '../core/const';

const AWSconfiguration = {
  region: AWS_CONFIG.region,
  secretAccessKey: AWS_CONFIG.secretAccessKey,
  accessKeyId: AWS_CONFIG.accessKeyId,
};
  
const AWSdocClient = new AWS.DynamoDB.DocumentClient(AWSconfiguration);

export const fetchData = (tableName) => {
  var params = {
      TableName: tableName
  }

  AWSdocClient.scan(params, function (err, data) {
      if (!err) {
          return data;
      }
      console.warn('AWSdocClient.scan error', err);
  });
};

export const putData = (tableName , data) => {
  var params = {
      TableName: tableName,
      Item: data
  }
  
  AWSdocClient.put(params, (err, data) => {
      if (err) {
          console.warn('AWSdocClient.put error', err);
      } else {
          console.warn('AWSdocClient.put Success', data);
      }
  });
}