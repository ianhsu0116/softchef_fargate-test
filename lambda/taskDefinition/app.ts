import {
  ECSClient,
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
      // taskRoleArn: "arn:aws:iam::520095059637:role/testProject",
      taskRoleArn: "arn:aws:iam::520095059637:role/test0525",
      runtimePlatform: {
        cpuArchitecture: "ARM64",
      },
      containerDefinitions: [
        {
          name: "taskDefinitionContainerName",
          // name: "sampleTaskDefinitionContainerName",
          image:
            "520095059637.dkr.ecr.us-west-2.amazonaws.com/ex-service:latest",
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
    const response = await client.send(command);

    console.log(response.taskDefinition?.taskDefinitionArn);
  } catch (e) {
    console.log("============try catch error2===========");
    console.log(e);
  }
};

// handler();
