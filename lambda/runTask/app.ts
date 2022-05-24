import * as AWS from "@aws-sdk/client-ecs";
import { Request } from "@softchef/lambda-events";

export const handler = async (event: any = {}): Promise<any> => {
  try {
    const request = new Request(event);
    const ecs = new AWS.ECSClient({
      region: "us-west-2",
    });

    var params: AWS.RunTaskCommandInput = {
      cluster: "testCluster",
      // taskDefinition: request.body("taskDefinitionArn"),
      taskDefinition: request.body.taskDefinitionArn,
      launchType: "FARGATE",
    };

    const command = new AWS.RunTaskCommand(params);
    const response = await ecs.send(command);

    console.log(response);
  } catch (e) {
    console.log("============try catch error===========");
    console.log(e);
  }
};
