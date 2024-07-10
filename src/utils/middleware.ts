import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from 'axios';
import { adLogin } from './authenticate';

export const basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // check for basic auth header
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf('Basic ') == -1
  ) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .send({ status: false, error: 'Missing Authorization Header' });
  }

  // get auth credentials
  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii',
  );

  // find the first : to split the username and password
  const colonIndex = credentials.indexOf(':');
  if (colonIndex === -1) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .send({ status: false, error: 'Invalid Authorization Header' });
  }

  const username = credentials.slice(0, colonIndex);
  const password = credentials.slice(colonIndex + 1);

  if (username.length == 0 || password.length == 0) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .send({ status: false, error: 'Invalid Authorization Header' });
  }

  adLogin(username, password)
    .then(v => {
      console.log('INFO: Authenticated user: ', v.U);
      next();
    })
    .catch(e => {
      return res
        .status(HttpStatusCode.Unauthorized)
        .send({ status: false, error: e });
    });
};
