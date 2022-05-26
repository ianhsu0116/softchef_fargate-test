import { EC2Client, DescribeSubnetsCommand } from "@aws-sdk/client-ec2"; // ES Modules import
import { Response } from '@softchef/lambda-events';

export const handler = async (event: any = {}): Promise<any> => {
  const response = new Response();
  try {
    const client = new EC2Client({
      region: "us-west-2"
    });

    const command = new DescribeSubnetsCommand({});
    const subnetList = await client.send(command);
    const arr = subnetList.Subnets;

    const subnets: any = [];
    arr?.forEach((ele: any) => {
      const smallObj = {
        type: "",
        subnetId: "",
      };
      smallObj.subnetId = ele.SubnetId;
      ele.Tags.forEach((tag: any) => {
        if (tag.Key === 'aws-cdk:subnet-type') {
          smallObj.type = tag.Value;
        }
      });
      subnets.push(smallObj);
    });

    return response.json({
      subnets,
    });

  } catch (e) {
    console.log('============try catch error===========');
    console.log(e);
  }

};

handler();