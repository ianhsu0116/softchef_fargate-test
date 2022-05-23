import * as AWS from "aws-sdk";

export const handler = async (): Promise<any> => {
  try {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    const ecs = new AWS.ECS();
    const params: AWS.ECS.Types.RegisterTaskDefinitionRequest = {
      family: "test",
      cpu: ".25",
      memory: "512",
      // runtimePlatform: {
      //   cpuArchitecture: "ARM64",
      // },
      containerDefinitions: [
        {
          name: "taskDefinitionContainerName",
          image: "ex-service",
        },
      ],
    };
    console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
    console.log(ecs.registerTaskDefinition);
    await ecs.registerTaskDefinition(params, function (err, data) {
      console.log('ccccccccccccccccccccccccccccccc');
      if (err) {
        console.log('111111111111111111111111111111111');
        console.log("=========error=========");
        console.log(err);
        return;
      }
      console.log('22222222222222222222222222222222222');
      console.log("============success===========");
      console.log("taskDefinitionArn: ", data.taskDefinition);
      return { statusCode: 200, body: JSON.stringify(data) };
    });
    console.log('ddddddddddddddddddddddddddddddd');
  } catch (e) {
    console.log("============try catch error===========");
    console.log(e);
  }
};
