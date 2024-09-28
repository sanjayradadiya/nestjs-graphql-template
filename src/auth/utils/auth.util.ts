import { ExtractJwt } from 'passport-jwt';

export function extractAuthToken(request): string | undefined {
  if (request?.headers?.authorization) {
    const payLoad = ExtractJwt.fromAuthHeaderAsBearerToken();
    const token = payLoad(request);
    return token;
  }
  if (request?.headers?.referer) {
    const authorizationArray = request?.headers?.referer.split(
      'https://teamhris.netlify.app/graphql?accessToken=',
    );
    return authorizationArray[authorizationArray.length - 1];
  }

  if (request?.accesstoken) {
    return request.headers.accesstoken;
  }
  if (request.cookies && request.cookies.accessToken) {
    return request.cookies.accessToken;
  }

  return undefined;
}
