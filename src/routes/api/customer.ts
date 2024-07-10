import express, { Request, Response } from 'express';
import http from '../../utils/http';
import constant from '../../utils/constant';
import { getSoapRequestXML } from '../../utils/xml';
import { soapRequestErrorHandler } from '../../utils/exception';
import { VertexCustomer, VertexCustomerSchema } from '../../models/customer';
import { SOAP_CUSTOMER_SERVICE } from '../../utils/config';

const router = express.Router();

/**
 * @swagger
 * /api/customer:
 *   post:
 *     summary: 1.1 Create Customer
 *     tags:
 *      - Customer Service
 *     description: Creates a new customer record in the Vertex O Series system.
 *     requestBody:
 *       description: The customer data to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VertexCustomer'
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
    const customer = VertexCustomerSchema.parse(req.body) as VertexCustomer;
    const xml = getSoapRequestXML({
      CreateCustomerRequest: {
        $: {
          xmlns: 'urn:vertexinc:oseries:taxdata:customer:9:0',
        },
        Customer: {
          CustomerKey: {
            $: {
              customerClassIndicator:
                customer.CustomerKey.customerClassIndicator ?? false,
            },
            OwningTaxpayer: {
              CompanyCode: 'COMPANY_CODE',
              DivisionCode: '0000',
            },
            Code: customer.CustomerKey.Code,
            Name: customer.CustomerKey.Name,
          },
          Registrations: {
            Registration: customer.Registrations,
          },
          Contacts: {
            Contact: customer.Contacts,
          },
          isExempt: customer.isExempt,
          EffectiveDate: customer.EffectiveDate,
          EndDate: customer.EndDate,

          // ParentCustomerCode: 's',
          // EffectiveDate: '2023-08-16',
          // EndDate: '2023-08-09Z',
          // isExempt: false,
          // ReasonCode: 'W',
          // Note: 's',
          // DiscountCategory: 's',
          // ShippingTerms: 'EXW',
          // CustomField1: 's',
          // CustomField2: 's',
        },
        SystemContext: constant.VERTEX_API_SYSTEM_CONTEXT,
      },
    });

    const response = await http.soap.post(SOAP_CUSTOMER_SERVICE || '/', xml);
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
 * /api/customer:
 *   put:
 *     summary: 1.2 Update Customer
 *     tags:
 *      - Customer Service
 *     description: Updates an existing customer record in the Vertex O Series system.
 *     requestBody:
 *       description: The customer data to update, CustomerKey.Code is required to be exist in the Vertex O Series.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VertexCustomer'
 *     responses:
 *       '200':
 *         description: Update customer success response.
 *       '400':
 *         description: Invalid request body.
 *       '500':
 *         description: Internal server error.
 */
router.put('/', async (req: Request, res: Response) => {
  try {
    const customer = VertexCustomerSchema.parse(req.body) as VertexCustomer;
    const xml = getSoapRequestXML({
      UpdateCustomerRequest: {
        $: {
          xmlns: 'urn:vertexinc:oseries:taxdata:customer:9:0',
        },
        Customer: {
          CustomerKey: {
            $: {
              customerClassIndicator:
                customer.CustomerKey.customerClassIndicator,
            },
            OwningTaxpayer: {
              CompanyCode: 'COMPANY_CODE',
              DivisionCode: '0000',
            },
            Code: customer.CustomerKey.Code,
            Name: customer.CustomerKey.Name,
          },
          Registrations: {
            Registration: customer.Registrations,
          },
          Contacts: {
            Contact: customer.Contacts,
          },
          isExempt: customer.isExempt,
          EffectiveDate: customer.EffectiveDate,
          EndDate: customer.EndDate,

          // ParentCustomerCode: 's',
          // EffectiveDate: '2023-08-16',
          // EndDate: '2023-08-09Z',
          // isExempt: false,
          // ReasonCode: 'W',
          // Note: 's',
          // DiscountCategory: 's',
          // ShippingTerms: 'EXW',
          // CustomField1: 's',
          // CustomField2: 's',
        },
        SystemContext: constant.VERTEX_API_SYSTEM_CONTEXT,
      },
    });

    const response = await http.soap.post(SOAP_CUSTOMER_SERVICE || '/', xml);
    res.json({
      status: true,
      body: response.data ?? '',
    });
  } catch (err: unknown) {
    soapRequestErrorHandler(err, res);
  }
});

export default router;
