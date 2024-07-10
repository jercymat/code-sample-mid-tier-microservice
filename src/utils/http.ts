import axios from 'axios';
import {
  SOAP_API_HOST,
  SOAP_AUTH_CLIENT_ID,
  SOAP_AUTH_SECRET,
  SOAP_AUTH_HOST,
  SOAP_TOKEN_TIMEOUT_S,
} from './config';

let bearerToken: string;
let tokenTimeStamp: number;

// Get the bearer token from the auth server
const getBearerToken = async () => {
  if (
    !bearerToken ||
    tokenTimeStamp + parseInt(SOAP_TOKEN_TIMEOUT_S || '1200') * 1000 <
      Date.now()
  ) {
    const response = await axios.post(SOAP_AUTH_HOST, undefined, {
      params: {
        grant_type: 'client_credentials',
        client_id: SOAP_AUTH_CLIENT_ID,
        client_secret: SOAP_AUTH_SECRET,
      },
    });
    bearerToken = response.data.access_token;
    tokenTimeStamp = Date.now();

    console.log(
      `INFO: Token refreshed, timestamp: ${tokenTimeStamp}, timeout: ${SOAP_TOKEN_TIMEOUT_S}s`,
    );
  }

  return bearerToken;
};

const soapClient = axios.create({
  baseURL: SOAP_API_HOST,
  timeout: 5000,
});

const generalClient = axios.create({
  timeout: 5000,
});

// Add a request interceptor to add bearer token to the request
soapClient.interceptors.request.use(async config => {
  config.headers['Content-Type'] = 'text/xml;charset=UTF-8';
  config.headers.Authorization = `Bearer ${await getBearerToken()}`;
  return config;
});

export default { soap: soapClient, general: generalClient };
