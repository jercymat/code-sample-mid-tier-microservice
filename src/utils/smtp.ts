import nodemailer from 'nodemailer';
import { EMAIL_VERTEX_TEAM, SMTP_HOST, SMTP_PORT } from './config';

const getSendMailOptions = (options: {
  to: string | string[];
  subject: string;
  text?: string | undefined;
  html?: string | undefined;
}) =>
  <nodemailer.SendMailOptions>{
    from: EMAIL_VERTEX_TEAM,
    ...options,
  };

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT || '25'),
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  dnsTimeout: 5000,
  connectionTimeout: 10000,
});

export default { transporter, getSendMailOptions };
