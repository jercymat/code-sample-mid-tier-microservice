import express, { Request, Response } from 'express';
import http from '../../utils/http';
import constant from '../../utils/constant';
import { getSoapRequestXML } from '../../utils/xml';
import { soapRequestErrorHandler } from '../../utils/exception';
import {
  VertexCertificate,
  VertexCertificateSchema,
  VertexCertificateSearch,
  VertexCertificateSearchSchema,
} from '../../models/certificate';
import { SOAP_CERTIFICATE_SERVICE } from '../../utils/config';

const router = express.Router();

/**
 * @swagger
 * /api/certificate:
 *   post:
 *     summary: 2.1 Create Certificate
 *     tags:
 *      - Certificate Service
 *     description: Creates a new certificate record in the Vertex O Series system.
 *     requestBody:
 *       description: The certificate data to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VertexCertificate'
 *     responses:
 *       '200':
 *         description: Create customer success response.
 *       '400':
 *         description: Invalid request body.
 *       '500':
 *         description: Internal server error.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const certificate = VertexCertificateSchema.parse(
      req.body,
    ) as VertexCertificate;
    const xml = getSoapRequestXML({
      CreateCertificateRequest: {
        $: {
          xmlns: 'urn:vertexinc:oseries:taxdata:certificate:9:0',
        },
        NewCertificate: {
          CertificateClass: 'EXEMPTION_CERTIFICATE',
          TransactionType: 'SALE',
          CertificateScope: 'BLANKET',
          Customer: {
            $: {
              customerClassIndicator:
                certificate.Customer.customerClassIndicator ?? false,
            },
            OwningTaxpayer: {
              CompanyCode: 'COMPANY_CODE',
              DivisionCode: '0000',
            },
            Code: certificate.Customer.Code,
            Name: certificate.Customer.Name,
          },
          EffectiveDate: certificate.EffectiveDate,
          EndDate: certificate.EndDate ?? null,
          Coverage: certificate.Coverages,
          Image: certificate.Images ?? null,
          Note: certificate.Note,

          // InvoiceNumber: 'string..............',
          // HardCopyReceivedIndicator: true,
          // HardCopyLocation:
          //   'string.........................................................................................................................................................................................................................................................',
          // IndustryClassification:
          //   'string......................................................',
          // Note: 'string',
        },
        SystemContext: constant.VERTEX_API_SYSTEM_CONTEXT,
      },
    });

    const response = await http.soap.post(SOAP_CERTIFICATE_SERVICE || '/', xml);
    res.json({
      status: true,
      body: response.data ?? '',
    });
  } catch (err: unknown) {
    soapRequestErrorHandler(err, res);
  }
});

/**
 * @swagger
 * /api/certificate/find:
 *   post:
 *     summary: 2.2 Find Certificates
 *     tags:
 *      - Certificate Service
 *     description: Find certificate records which is already uploaded to the Vertex O Series system.
 *     requestBody:
 *       description: The certificate search query.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VertexCertificateSearch'
 *     responses:
 *       '200':
 *         description: Create customer success response.
 *       '400':
 *         description: Invalid request body.
 *       '500':
 *         description: Internal server error.
 */
router.post('/find', async (req: Request, res: Response) => {
  try {
    const certificateSearch = VertexCertificateSearchSchema.parse(
      req.body,
    ) as VertexCertificateSearch;

    // manually check if certificateSearch is empty
    if (Object.keys(certificateSearch).length === 0) {
      res.status(400).json({
        status: false,
        error: 'payload is invalid',
      });
      return;
    }

    const xml = getSoapRequestXML({
      FindCertificatesRequest: {
        $: {
          xmlns: 'urn:vertexinc:oseries:taxdata:certificate:9:0',
        },
        CertificateSearch: certificateSearch,
        SystemContext: constant.VERTEX_API_SYSTEM_CONTEXT,
      },
    });

    const response = await http.soap.post(SOAP_CERTIFICATE_SERVICE || '/', xml);
    res.json({
      status: true,
      body: response.data ?? '',
    });
  } catch (err: unknown) {
    soapRequestErrorHandler(err, res);
  }
});

export default router;
