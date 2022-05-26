import {
  ECSClient,
  RunTaskCommand,
  RunTaskCommandInput,
} from '@aws-sdk/client-ecs';
import { Request, Response } from '@softchef/lambda-events';

export const handler = async (event: any = {}): Promise<any> => {
  try {
    const request = new Request(event);
    const response = new Response();
    const client = new ECSClient({
      region: 'us-west-2',
    });

    const params: RunTaskCommandInput = {
      cluster: 'arn:aws:ecs:us-west-2:520095059637:cluster/testCluster',
      taskDefinition: request.body.taskDefinitionArn,
      // taskDefinition:
      //   'arn:aws:ecs:us-west-2:520095059637:task-definition/test:38',
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [request.body.subnet],
          // securityGroups: ["sg-1b7e7134"]
        },
      },
    };

    console.log(params);

    const command = new RunTaskCommand(params);
    await client.send(command);

    return response.json({
      data: "done",
    });

  } catch (e) {
    console.log('============try catch error===========');
    console.log(e);
  }
};

// handler();
