async function generatePolicy(effect: string, resource: string, context:Record<string, string> = {}): Promise<Record<string, any>> {
  const authResponse: Record<string, any> = {};
  authResponse.principalId = "user";
  if (effect && resource) {
    const policyDocument: Record<string, any> = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne: Record<string, any> = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  authResponse.context = context;
  return authResponse;
}


export async function authorizerHandler(event: Record<string, any>): Promise<Record<string, any>> {
  const token: string = event.authorizationToken.split(" ")[1]

  if (!token) {
    return await generatePolicy("Deny", event.methodArn, {})
  }

  // TODO: Need to get roles from user-service using the token
  return await generatePolicy("Allow", event.methodArn, {})
}