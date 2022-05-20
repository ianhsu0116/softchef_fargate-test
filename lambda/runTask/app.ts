import * as AWS from 'aws-sdk';
import { Request } from '@softchef/lambda-events';

export const handler = async (event: any = {}): Promise<any> => {
  try {
    const request = new Request(event);
    const ecs = new AWS.ECS();
    var params = {
      cluster: "testCluster",
      taskDefinition: request.parameter('taskDefinitionArn')
    };

    ecs.runTask(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        return;
      }
      console.log('============success===========');
      console.log(JSON.stringify(data));
    });


  } catch (e) {
    console.log('============try catch error===========');
    console.log(e);
  }

};