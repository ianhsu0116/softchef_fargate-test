import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecspatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as servicediscovery from "aws-cdk-lib/aws-servicediscovery";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
// import * as path from 'path';
import {
  Construct,
} from 'constructs';


export class testECSServiceStack extends cdk.Stack {
  public readonly restApiId: string;
  //Export Vpclink and ALB Listener
  public readonly httpVpcLink: cdk.CfnResource;
  public readonly httpApiListener: elbv2.ApplicationListener;

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

    
    // Cloud Map Namespace
    const dnsNamespace = new servicediscovery.PrivateDnsNamespace(
      this,
      "DnsNamespace",
      {
        name: "http-api.local",
        vpc: vpc,
        description: "Private DnsNamespace for Microservices",
      }
    );

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

    // Log Groups
    const testServiceLogGroup = new logs.LogGroup(this, "testServiceLogGroup", {
      logGroupName: "/ecs/testService",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Log Driver
    const testServiceLogDriver = new ecs.AwsLogDriver({
      logGroup: testServiceLogGroup,
      streamPrefix: "testService",
    });


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
        image: ecs.ContainerImage.fromEcrRepository(testservicerepo),
        logging: testServiceLogDriver,
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
    

    // Fargate Services
    const tsetService = new ecs.FargateService(this, "tsetService", {
      cluster: cluster,
      taskDefinition: testServiceTaskDefinition,
      assignPublicIp: false,
      desiredCount: 2,
      securityGroups: [testServiceSG],
      cloudMapOptions: {
        name: "testService",
        cloudMapNamespace: dnsNamespace,
      },
    });

    // ALB
    const httpApiInternalALB = new elbv2.ApplicationLoadBalancer(
      this,
      "httpapiInternalALB",
      {
        vpc: vpc,
        internetFacing: false,
      }
    );

    // ALB Listener
    this.httpApiListener = httpApiInternalALB.addListener("httpapiListener", {
      port: 80,
      // Default Target Group
      defaultAction: elbv2.ListenerAction.fixedResponse(200),
    });

    // Target Groups
    const tsetServiceTargetGroup = this.httpApiListener.addTargets(
      "tsetServiceTargetGroup",
      {
        port: 80,
        // priority: 1,
        healthCheck: {
          path: "/api/test/health",
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(3),
        },
        targets: [tsetService],
        // pathPattern: "/api/test*",
      }
    );

    //VPC Link
    this.httpVpcLink = new cdk.CfnResource(this, "HttpVpcLink", {
      type: "AWS::ApiGatewayV2::VpcLink",
      properties: {
        Name: "http-api-vpclink",
        SubnetIds: vpc.privateSubnets.map((m) => m.subnetId),
      },
    });



    
  }
}

const app = new cdk.App();
new testECSServiceStack(app, 'testECSServiceStack');
app.synth();
