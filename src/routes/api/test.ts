import express, { Request, Response } from 'express';
import {
  SOAP_AUTH_CLIENT_ID,
  SOAP_AUTH_HOST,
  SOAP_AUTH_SECRET,
} from '../../utils/config';
import { AxiosError, isAxiosError, HttpStatusCode } from 'axios';
import http from '../../utils/http';

const router = express.Router();

router.get('/auth', async (req: Request, res: Response) => {
  res.json({
    status: true,
    message: 'Welcome to the API!',
  });
});

router.get('/connection', async (req: Request, res: Response) => {
  try {
    const response = await http.general.post(SOAP_AUTH_HOST, undefined, {
      params: {
        grant_type: 'client_credentials',
        client_id: SOAP_AUTH_CLIENT_ID,
        client_secret: SOAP_AUTH_SECRET,
      },
    });

    const bearerTokenHead = response.data.access_token.substring(0, 5);
    const tokenTimeStamp = Date.now();

    res.json({
      status: true,
      token: {
        bearerTokenHead,
        tokenTimeStamp,
      },
    });
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const error = err as AxiosError;

      res
        .status(error.response?.status ?? HttpStatusCode.InternalServerError)
        .json({ status: false, message: error.message, stack: error.stack });
      return;
    }

    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: false, message: err });
  }
});

export default router;
