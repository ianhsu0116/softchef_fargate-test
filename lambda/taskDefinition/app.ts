import {
  ECSClient,
  LogConfiguration,
  RegisterContainerInstanceCommand,
  RegisterContainerInstanceCommandInput,
  RegisterTaskDefinitionCommand,
  RegisterTaskDefinitionCommandInput,
} from "@aws-sdk/client-ecs";

export const handler = async (): Promise<any> => {
  const client = new ECSClient({
    region: "us-west-2",
  });

  try {
    const params: RegisterTaskDefinitionCommandInput = {
      family: "test",
      cpu: "512",
      memory: "1024",
      requiresCompatibilities: ["FARGATE"],
      networkMode: "awsvpc",
      executionRoleArn: "arn:aws:iam::520095059637:role/testProject",
      // runtimePlatform: {
      //   cpuArchitecture: "ARM64",
      // },
      containerDefinitions: [
        {
          name: "taskDefinitionContainerName",
          image:
            "520095059637.dkr.ecr.us-west-2.amazonaws.com/ex-service:latest",
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group": "/ecs/runTask",
              "awslogs-region": "us-west-2",
              // "awslogs-create-group": "true",
              "awslogs-stream-prefix": "testRunTask",
            },
          },
        },
      ],
    };

    const command = new RegisterTaskDefinitionCommand(params);
    const response = await client.send(command);

    console.log(response.taskDefinition?.taskDefinitionArn);
  } catch (e) {
    console.log("============try catch error2===========");
    console.log(e);
  }
};

handler();
