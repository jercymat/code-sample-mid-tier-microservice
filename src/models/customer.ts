import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     VertexCustomerKey:
 *       type: object
 *       properties:
 *         customerClassIndicator:
 *           type: boolean
 *           description: Whether the customer is a class indicator
 *         Code:
 *           type: string
 *           description: The customer code
 *         Name:
 *           type: string
 *           description: The customer name
 *         OwningTaxpayer:
 *           type: object
 *           properties:
 *             CompanyCode:
 *               type: string
 *               description: The company code of the owning taxpayer
 *             DivisionCode:
 *               type: string
 *               description: The division code of the owning taxpayer
 *             DepartmentCode:
 *               type: string
 *               description: The department code of the owning taxpayer
 *             Name:
 *               type: string
 *               description: The name of the owning taxpayer
 *           required:
 *            - CompanyCode
 *           additionalProperties: false
 *       required:
 *         - Code
 *         - Name
 *       additionalProperties: false
 *     VertexCustomerRegistration:
 *       type: object
 *       properties:
 *         RegisteredJurisdiction:
 *           type: object
 *           properties:
 *             Country:
 *               type: string
 *               description: The country of the registered jurisdiction
 *             MainDivision:
 *               type: string
 *               description: The main division of the registered jurisdiction
 *           required:
 *             - Country
 *           additionalProperties: false
 *         RegistrationId:
 *           type: string
 *           description: The registration ID of the customer
 *         RegistrationClassification:
 *           type: string
 *           description: The registration classification of the customer
 *       required:
 *        - RegisteredJurisdiction
 *       additionalProperties: false
 *     VertexCustomerContact:
 *       type: object
 *       properties:
 *         ContactClassification:
 *           type: string
 *           description: The contact classification of the customer
 *         FirstName:
 *           type: string
 *           description: The first name of the customer contact
 *         LastName:
 *           type: string
 *           description: The last name of the customer contact
 *         StreetAddress:
 *           type: string
 *           description: The street address of the customer contact
 *         StreetAddress2:
 *           type: string
 *           description: The second street address of the customer contact
 *         City:
 *           type: string
 *           description: The city of the customer contact
 *         MainDivision:
 *           type: string
 *           description: The main division of the customer contact
 *         PostalCode:
 *           type: string
 *           description: The postal code of the customer contact
 *         Country:
 *           type: string
 *           description: The country of the customer contact
 *         Department:
 *           type: string
 *           description: The department of the customer contact
 *         PhoneNumber:
 *           type: string
 *           description: The phone number of the customer contact
 *         FaxNumber:
 *           type: string
 *           description: The fax number of the customer contact
 *         Email:
 *           type: string
 *           description: The email address of the customer contact
 *       additionalProperties: false
 *       required:
 *         - ContactClassification
 *     VertexCustomer:
 *       type: object
 *       properties:
 *         CustomerKey:
 *           $ref: '#/components/schemas/VertexCustomerKey'
 *         Registrations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VertexCustomerRegistration'
 *         Contacts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VertexCustomerContact'
 *         isExempt:
 *           type: boolean
 *           description: Whether the customer is exempt from taxes
 *         EffectiveDate:
 *           type: string
 *           format: date
 *           description: The effective date of the customer record
 *         EndDate:
 *           type: string
 *           format: date
 *           description: The end date of the customer record
 *       required:
 *        - CustomerKey
 *        - Registrations
 *        - Contacts
 *       additionalProperties: false
 */

const VertexCustomerKeySchema = z.object({
  customerClassIndicator: z.boolean().optional(),
  Code: z.string(),
  Name: z.string(),
  OwningTaxpayer: z
    .object({
      CompanyCode: z.string(),
      DivisionCode: z.string().optional(),
      DepartmentCode: z.string().optional(),
      Name: z.string().optional(),
    })
    .optional(),
});

const VertexCustomerRegistrationSchema = z.object({
  RegisteredJurisdiction: z.object({
    Country: z.string(),
    MainDivision: z.string().optional(),
  }),
  RegistrationId: z.string().optional(),
  RegistrationClassification: z.string().optional(),
});

const VertexCustomerContactSchema = z.object({
  ContactClassification: z.string(),
  FirstName: z.string().optional(),
  LastName: z.string().optional(),
  StreetAddress: z.string().optional(),
  StreetAddress2: z.string().optional(),
  City: z.string().optional(),
  MainDivision: z.string().optional(),
  PostalCode: z.string().optional(),
  Country: z.string().optional(),
  Department: z.string().optional(),
  PhoneNumber: z.string().optional(),
  FaxNumber: z.string().optional(),
  Email: z.string().optional(),
});

export const VertexCustomerSchema = z.object({
  CustomerKey: VertexCustomerKeySchema,
  Registrations: z.array(VertexCustomerRegistrationSchema),
  Contacts: z.array(VertexCustomerContactSchema),
  isExempt: z.boolean().optional(),
  EffectiveDate: z.string().optional(),
  EndDate: z.string().optional(),
});

export type VertexCustomer = z.infer<typeof VertexCustomerSchema>;
