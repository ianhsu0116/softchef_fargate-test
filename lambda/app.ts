export const handler = async (event: any = {}): Promise<any> => {
  const str = 'Hello fargate, goodnight!';
  return { statusCode: 200, body: str };
};