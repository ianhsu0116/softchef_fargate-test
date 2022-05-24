import * as AWS from "@aws-sdk/client-ecs";
import { Console } from "console";

export const handler = async (): Promise<any> => {
  try {
    const ecs = new AWS.ECSClient({
      region: "us-west-2",
    });

    const params = {
      family: "test",
      cpu: "512",
      memory: "1024",
      // runtimePlatform: {
      //   cpuArchitecture: "ARM64",
      // },
      containerDefinitions: [
        {
          name: "taskDefinitionContainerName",
          image:
            "520095059637.dkr.ecr.us-west-2.amazonaws.com/ex-service/ex-service:latest",
        },
      ],
    };

    const command = new AWS.RegisterTaskDefinitionCommand(params);
    const response = await ecs.send(command);

    console.log("ddddddddddddddddddddddddddddddd");
  } catch (e) {
    console.log("============try catch error===========");
    console.log(e);
  }
};
