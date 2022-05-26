import {
  ECSClient,
  RegisterTaskDefinitionCommand,
  RegisterTaskDefinitionCommandInput,
} from "@aws-sdk/client-ecs";
import { Response } from '@softchef/lambda-events';

export const handler = async (event: any = {}): Promise<any> => {
  const client = new ECSClient({
    region: "us-west-2",
  });
  const response = new Response();
  try {
    const params: RegisterTaskDefinitionCommandInput = {
      family: "Deploy",
      cpu: "512",
      memory: "1024",
      requiresCompatibilities: ["FARGATE"],
      networkMode: "awsvpc",
      executionRoleArn: "arn:aws:iam::520095059637:role/testProject",
      taskRoleArn: "arn:aws:iam::520095059637:role/test0525",
      // runtimePlatform: {
      //   cpuArchitecture: "ARM64",
      // },
      containerDefinitions: [
        {
          environment: [
            {
              "name": "GIT_REPO_URL",
              "value": event.body.gitRepoUrl,
            }
          ],
          name: "taskDefinitionContainerName",
          image: `520095059637.dkr.ecr.us-west-2.amazonaws.com/ex-service:${event.body.imageTag}`,
          cpu: 512,
          memory: 1024,
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-create-group": "true",
              "awslogs-group": "/softChef",
              "awslogs-region": "us-west-2",
              "awslogs-stream-prefix": "softChef-example",
            },
          },
        },
      ],
    };

    const command = new RegisterTaskDefinitionCommand(params);
    const taskDefinition = await client.send(command);

    console.log(taskDefinition.taskDefinition?.taskDefinitionArn);

    return response.json({
      taskDefinitionArn: taskDefinition.taskDefinition?.taskDefinitionArn,
    });

  } catch (e) {
    console.log("============try catch error2===========");
    console.log(e);
  }
};

// handler();
