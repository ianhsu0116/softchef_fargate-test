import { ECSClient, RunTaskCommand, RunTaskCommandInput } from "@aws-sdk/client-ecs";
import { Request } from '@softchef/lambda-events';

export const handler = async (event: any = {}): Promise<any> => {
  try {
    const request = new Request(event);
    const client = new ECSClient({
      region: 'us-west-2'
    });

    const params: RunTaskCommandInput = {
      cluster: "arn:aws:ecs:us-west-2:520095059637:cluster/testCluster",
      taskDefinition: request.body.taskDefinitionArn,
      launchType: "EC2"
    };

    console.log(params)

    const command = new RunTaskCommand(params);
    const response = await client.send(command);

    console.log(response.tasks);



  } catch (e) {
    console.log('============try catch error===========');
    console.log(e);
  }

};