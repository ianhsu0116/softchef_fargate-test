import * as path from "path";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
// import * as path from 'path';
import { Construct } from "constructs";
import { ContainerImage } from "aws-cdk-lib/aws-ecs";
import { RestApi, HttpMethod } from "@softchef/cdk-restapi";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";

export interface TestAppStackProps extends cdk.NestedStackProps {
  readonly authorizationType?: apigateway.AuthorizationType;
  readonly authorizer?: apigateway.IAuthorizer | undefined;
}

const LAMBDA_ASSETS_PATH = path.resolve(__dirname, "./lambda");

export class testECSServiceStack extends cdk.Stack {
  public readonly restApiId: string;
  //Export Vpclink and ALB Listener
  public readonly httpVpcLink: cdk.CfnResource;
  public readonly httpApiListener: elbv2.ApplicationListener;

  constructor(scope: Construct, id: string, props?: TestAppStackProps) {
    super(scope, id);

    // Create a VPC with 9x subnets divided over 3 AZ's
    const vpc = new ec2.Vpc(this, "testVpc", {
      cidr: "172.31.0.0/16",
      natGateways: 1,
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 20,
          name: "public_projectTest",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 20,
          name: "private_projectTest",
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
      ],
    });

    // Create an ECS cluster
    new ecs.Cluster(this, "test-cluster", {
      clusterName: "testCluster",
      containerInsights: true,
      vpc: vpc,
    });

    const restApi = new RestApi(this, "taskRunningApi", {
      enableCors: true,
      resources: [
        {
          path: "/task_definition",
          httpMethod: HttpMethod.POST,
          lambdaFunction: this.TaskDefinitionFunction(),
          authorizationType: apigateway.AuthorizationType.IAM,
        },
        {
          path: "/run_task",
          httpMethod: HttpMethod.PUT,
          lambdaFunction: this.RunTaskFunction(),
          authorizationType: apigateway.AuthorizationType.IAM,
        },
      ],
    });
    this.restApiId = restApi.restApiId;

    const myImage = new DockerImageAsset(this, "my-image", {
      directory: "./ex-service",
    });
    // Get image uri
    console.log(myImage.imageUri);
    // Transfer container image for task use.
    ContainerImage.fromDockerImageAsset(myImage);
  }
  private TaskDefinitionFunction(): lambdaNodejs.NodejsFunction {
    const definitionFunction = new lambdaNodejs.NodejsFunction(
      this,
      "taskDefinitionFunction",
      {
        entry: `${LAMBDA_ASSETS_PATH}/taskDefinition/app.ts`,
      }
    );
    definitionFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "taskDefinitionFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: [
              "execute-api:Invoke",
              "execute-api:ManageConnections",
              "*",
            ],
            resources: ["*"],
          }),
        ],
      })
    );
    return definitionFunction;
  }
  private RunTaskFunction(): lambdaNodejs.NodejsFunction {
    const runFunction = new lambdaNodejs.NodejsFunction(
      this,
      "runTaskFunction",
      {
        entry: `${LAMBDA_ASSETS_PATH}/runTask/app.ts`,
      }
    );
    runFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "RunTaskFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: [
              "execute-api:Invoke",
              "execute-api:ManageConnections",
              "*",
            ],
            resources: ["*"],
          }),
        ],
      })
    );
    return runFunction;
  }
}

const app = new cdk.App();
new testECSServiceStack(app, "testECSServiceStack");
app.synth();
