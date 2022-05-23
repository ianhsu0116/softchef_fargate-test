export const handler = async (): Promise<any> => {
  try {
    const data = {
      message: "looks good!",
    };
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
