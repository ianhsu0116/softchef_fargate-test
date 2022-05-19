import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecspatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  Construct,
} from 'constructs';
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import {
  HttpLambdaIntegration,
} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';


const LAMBDA_ASSETS_PATH = path.resolve(__dirname, './lambda');

export class testECSServiceStack extends cdk.Stack {
  public readonly restApiId: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC with 9x subnets divided over 3 AZ's
    const vpc = new ec2.Vpc(this, 'testVpc', {
      cidr: '172.31.0.0/16',
      natGateways: 1,
      maxAzs: 2,
    });

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, 'test-cluster', {
      clusterName: 'testCluster',
      containerInsights: true,
      vpc: vpc,
    });

    // Create a Fargate container image
    const image = ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample');

    // Create higher level construct containing the Fargate service with a load balancer
    new ecspatterns.ApplicationLoadBalancedFargateService(this, 'amazon-ecs-sample', {
      cluster,
      circuitBreaker: {
        rollback: true,
      },
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        image,
        containerPort: 80,
        logDriver: ecs.LogDrivers.awsLogs({
          streamPrefix: id,
          logRetention: logs.RetentionDays.ONE_YEAR,
        }),
      },
    });


    // Task Role
    const taskrole = new iam.Role(this, "ecstestTaskExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });
    taskrole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AmazonECSTaskExecutionRolePolicy"
      )
    );

    
    // Task Definitions
    const testServiceTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "testServiceTaskDef",
      {
        memoryLimitMiB: 512,
        cpu: 256,
        taskRole: taskrole,
      }
    );
    // Amazon ECR Repositories
    const testservicerepo = ecr.Repository.fromRepositoryName(
      this,
      "ianTest-service",
      "ian_test-service"
    );

    // Task Containers
    const testServiceContainer = testServiceTaskDefinition.addContainer(
      "testServiceContainer",
      {
        image: ecs.ContainerImage.fromEcrRepository(testservicerepo)
      }
    );

    testServiceContainer.addPortMappings({
      containerPort: 80,
    });

    //Security Groups
    const testServiceSG = new ec2.SecurityGroup(
      this,
      "testServiceSecurityGroup",
      {
        allowAllOutbound: true,
        securityGroupName: "testServiceSecurityGroup",
        vpc,
      }
    );

    testServiceSG.connections.allowFromAnyIpv4(ec2.Port.tcp(80));
    // testServiceSG.connections.allowInternally(ec2.Port.tcp(80));

    // const testFunction = new lambda.NodejsFunction(this, 'createTestFunction', {
    //   entry: `${LAMBDA_ASSETS_PATH}/app.ts`,
    // });

    // const api = new HttpApi(this, 'testAPI', {
    //   apiName: 'testAPI',
    //   corsPreflight: {
    //     allowOrigins: ['*'],
    //     allowHeaders: ['*'],
    //     allowMethods: [
    //       CorsHttpMethod.ANY,
    //     ],
    //     allowCredentials: false,
    //     exposeHeaders: [],
    //     maxAge: cdk.Duration.seconds(300),
    //   },
    //   createDefaultStage: true,
    // });


    // api.addRoutes({
    //   path: '/test',
    //   methods: [HttpMethod.GET],
    //   integration: new HttpLambdaIntegration('getTestFunction', testFunction),
    // });

  }

}

const app = new cdk.App();
new testECSServiceStack(app, 'testECSServiceStack');
app.synth();
