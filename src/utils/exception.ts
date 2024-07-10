import { Response } from 'express';
import { AxiosError, isAxiosError, HttpStatusCode } from 'axios';
import { ZodError } from 'zod';
import xml2js from 'xml2js';

export const soapRequestErrorHandler = async (err: unknown, res: Response) => {
  if (isAxiosError(err)) {
    const error = err as AxiosError;

    // The request was made but no response was received
    if (!error.response) {
      res.json({
        status: false,
        error: error.message,
      });
      return;
    }

    // Response received but it is not sent by the Vertex API
    if (!error.response?.headers['content-type'].includes('text/xml')) {
      res.json({
        status: false,
        error: 'Error received from Vertex API is not in XML format',
        data: error.response?.data,
      });
      return;
    }

    const errData = (error.response?.data as string) ?? '';

    // Repsonse is in XML but it is not a SOAP response
    if (
      !errData.includes('soapenv:Envelope') ||
      !errData.includes('soapenv:Body')
    ) {
      res.json({
        status: false,
        error: 'Expect SOAP response from Vertex API but got something else',
        data: error.response?.data,
      });
      return;
    }

    // Received XML response from Vertex API
    const parsedXMLObject = await xml2js.parseStringPromise(errData);
    const errorString =
      parsedXMLObject['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault'][0]
        .faultstring[0]._ ?? '';

    console.log('ERROR: Vertex API error: ', errorString);

    if (errorString.includes('Customer already exists')) {
      res.status(HttpStatusCode.Conflict);
    }

    if (
      errorString.includes('Customer does not exist') ||
      errorString.includes('not found')
    ) {
      res.status(HttpStatusCode.NotFound);
    }

    res.json({
      status: false,
      error: errorString,
    });
    return;
  }

  if (err instanceof ZodError) {
    const error = err as ZodError;

    res.status(HttpStatusCode.BadRequest).json({
      status: false,
      error: 'payload is invalid',
    });
    return;
  }

  res.json({
    status: false,
    error: err ?? 'unknown error',
  });
  return;
};

export const mailRequestErrorHandler = (err: unknown, res: Response) => {
  if (err instanceof ZodError) {
    res.status(HttpStatusCode.BadRequest).json({
      status: false,
      error: 'payload is invalid',
    });
    return;
  }

  res.json({
    status: false,
    error: err,
  });
  return;
};
