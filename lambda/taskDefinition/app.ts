import * as AWS from "aws-sdk";

export const handler = async (event: any = {}): Promise<any> => {
  try {
    const ecs = new AWS.ECS();
    const params: AWS.ECS.Types.RegisterTaskDefinitionRequest = {
      family: "test",
      cpu: ".25",
      memory: "512",
      runtimePlatform: {
        cpuArchitecture: "ARM64",
      },
      containerDefinitions: [
        {
          name: "taskDefinitionContainerName",
          image: "ex-service",
        },
      ],
    };

    ecs.registerTaskDefinition(params, function (err, data) {
      if (err) {
        console.log("=========error=========");
        console.log(err);
        return;
      }

      console.log("============success===========");
      console.log("taskDefinitionArn: ", data.taskDefinition);
      console.log(JSON.stringify(data));
    });
  } catch (e) {
    console.log("============try catch error===========");
    console.log(e);
  }
};
