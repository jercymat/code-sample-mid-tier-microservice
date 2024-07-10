import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     JobCompleteMailContent:
 *       type: object
 *       properties:
 *         uploaded_certs:
 *           type: array
 *           items:
 *             type: string
 *             example: 'cert1.pdf'
 *           description: The uploaded certificates
 *         uploaded_custs:
 *           type: array
 *           items:
 *             type: string
 *             example: '12345678 - ACME CORP'
 *           description: The uploaded customers
 *         invalid_filenames:
 *           type: array
 *           items:
 *             type: string
 *             example: 'invalidfile.pdf'
 *           description: The invalid filenames
 *         upload_fail_certs:
 *           type: array
 *           items:
 *             type: string
 *             example: 'cert2.pdf'
 *           description: The failed certificate uploads
 *         upload_fail_custs:
 *           type: array
 *           items:
 *             type: string
 *             example: '12345678'
 *           description: The failed customer uploads
 *       required:
 *         - uploaded_certs
 *         - uploaded_custs
 *         - invalid_filenames
 *         - upload_fail_certs
 *         - upload_fail_custs
 *     JobCompleteMailData:
 *       type: object
 *       properties:
 *         to:
 *           type: array
 *           items:
 *             type: string
 *           description: The email recipients
 *         content:
 *           $ref: '#/components/schemas/JobCompleteMailContent'
 *       required:
 *         - to
 *         - content
 */
const JobCompleteMailContentSchema = z.object({
  uploaded_certs: z.array(z.string()),
  uploaded_custs: z.array(z.string()),
  invalid_filenames: z.array(z.string()),
  upload_fail_certs: z.array(z.string()),
  upload_fail_custs: z.array(z.string()),
});

export const JobCompleteMailDataSchema = z.object({
  to: z.array(z.string()),
  content: JobCompleteMailContentSchema,
});

export type JobCompleteMailData = z.infer<typeof JobCompleteMailDataSchema>;
