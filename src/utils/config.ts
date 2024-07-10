import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'local'}` });

export const {
  PORT,
  NODE_ENV,
  SERVICE_HOST,
  VERTEX_USERNAME,
  SOAP_API_HOST,
  SOAP_CUSTOMER_SERVICE,
  SOAP_CERTIFICATE_SERVICE,
  SOAP_DATAEXTRACT_SERVICE,
  SOAP_FILETRANSFER_SERVICE,
  SOAP_AUTH_HOST,
  SOAP_AUTH_CLIENT_ID,
  SOAP_TOKEN_TIMEOUT_S,
  LDAP_CON,
  LDAP_DN,
  SMTP_HOST,
  SMTP_PORT,
  EMAIL_VERTEX_TEAM,

  // sensitive data
  VERTEX_PASSWORD,
  SOAP_AUTH_SECRET,
} = process.env;