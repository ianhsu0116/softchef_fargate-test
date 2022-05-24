import { EC2Client, DescribeSubnetsCommand } from "@aws-sdk/client-ec2"; // ES Modules import


export const handler = async (event: any = {}): Promise<any> => {
  try {
    const client = new EC2Client({
      region: "us-west-2"
    });

    const command = new DescribeSubnetsCommand({});
    const response = await client.send(command);
    const arr = response.Subnets
    arr?.forEach(ele => {
      console.log(ele)
    })

  } catch (e) {
    console.log('============try catch error===========');
    console.log(e);
  }

};

handler();