import express, { Request, Response } from 'express';
import ejs from 'ejs';
import smtp from '../../utils/smtp';
import {
  JobCompleteMailData,
  JobCompleteMailDataSchema,
} from '../../models/mail';
import { mailRequestErrorHandler } from '../../utils/exception';

const router = express.Router();

/**
 * @swagger
 * /api/mail/send/jobComplete:
 *   post:
 *     summary: 3.1 Send Job Complete Mail
 *     tags:
 *      - Notification Emails
 *     description: Sends a job complete notification email to the recipients.
 *     requestBody:
 *       description: The email data to send.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobCompleteMailData'
 *     responses:
 *       '200':
 *         description: Send job complete mail success response.
 *       '400':
 *         description: Invalid request body.
 *       '500':
 *         description: Internal server error.
 */
router.post('/send/jobComplete', async (req: Request, res: Response) => {
  const today = new Date().toLocaleDateString('en-US');

  try {
    const mailData = JobCompleteMailDataSchema.parse(
      req.body,
    ) as JobCompleteMailData;

    const failed =
      mailData.content.invalid_filenames.length > 0 ||
      mailData.content.upload_fail_certs.length > 0 ||
      mailData.content.upload_fail_custs.length > 0;

    const template = await ejs.renderFile('src/views/jobCompleteMail.ejs', {
      date: today,
      failed,
      ...mailData.content,
    });

    const mailOptions = smtp.getSendMailOptions({
      to: mailData.to,
      subject: `${
        failed ? '[PARTIAL FAIL]' : ''
      } ${today} Job Complete Confirmation`,
      html: template,
    });

    smtp.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('ERROR:', error);
        res.json({ status: false, error });
      } else {
        console.log('INFO: Email sent: ' + info.response);
        res.json({ status: true, message: 'Email sent' });
      }
    });
  } catch (err: unknown) {
    mailRequestErrorHandler(err, res);
  }
});

export default router;
