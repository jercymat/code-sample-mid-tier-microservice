import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     VertexCertCustomerKey:
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
 *       additionalProperties: false
 *     VertexCertificateCoverage:
 *       type: object
 *       properties:
 *         Jurisdiction:
 *           type: object
 *           properties:
 *             Country:
 *               type: string
 *             MainDivision:
 *               type: string
 *           required:
 *            - Country
 *         CertificateNumber:
 *           type: string
 *         ReasonTypeName:
 *           type: string
 *         EffectiveDate:
 *           type: string
 *         EndDate:
 *           type: string
 *         IssueDate:
 *           type: string
 *         ExpirationDate:
 *           type: string
 *         ReviewDate:
 *           type: string
 *       required:
 *        - Jurisdiction
 *        - EffectiveDate
 *     VertexCertificateImage:
 *       type: object
 *       properties:
 *         ImageName:
 *           type: string
 *         ImageContent:
 *           type: string
 *       required:
 *        - ImageName
 *        - ImageContent
 *     VertexCertificate:
 *       type: object
 *       properties:
 *         Customer:
 *           $ref: '#/components/schemas/VertexCertCustomerKey'
 *         Coverages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VertexCertificateCoverage'
 *         Images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VertexCertificateImage'
 *         EffectiveDate:
 *           type: string
 *         EndDate:
 *           type: string
 *         Note:
 *           type: string
 *       required:
 *        - Customer
 *        - Coverages
 *        - EffectiveDate
 *     VertexCertificateSearch:
 *       type: object
 *       properties:
 *         CertificateId:
 *           type: number
 *         IncludeActiveIndicator:
 *           type: boolean
 *         IncludeExpiredIndicator:
 *           type: boolean
 *         IncludeExpiringIndicator:
 *           type: boolean
 *         IncludeFutureIndicator:
 *           type: boolean
 *         Jurisdiction:
 *           type: array
 *           items:
 *             type: number
 *         MainDivision:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               IsoAlphaCountryCode:
 *                 type: string
 *               MainDivisionName:
 *                 type: string
 *               IncludeChildJurisdictionsIndicator:
 *                 type: boolean
 *             required:
 *              - IsoAlphaCountryCode
 *              - MainDivisionName
 *         Taxpayer:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               CompanyCode:
 *                 type: string
 *               DivisionCode:
 *                 type: string
 *               DepartmentCode:
 *                 type: string
 *               Name:
 *                 type: string
 *             required:
 *              - CompanyCode
 *         CustomerCode:
 *           type: array
 *           items:
 *             type: string
 *         Uuid:
 *           type: string
 *         CertificateNumber:
 *           type: string
 *         MinReviewDate:
 *           type: string
 *         MaxReviewDate:
 *           type: string
 *         MinExpirationDate:
 *           type: string
 *         MaxExpirationDate:
 *           type: string
 *         TransactionType:
 *           type: array
 *           items:
 *             type: string
 *         CertificateScope:
 *           type: array
 *           items:
 *             type: string
 *         ImpositionTypeName:
 *           type: string
 *         UserDefinedImpositionTypeIndicator:
 *           type: boolean
 *         ValidationStatus:
 *           type: string
 *         ReplacedIndicator:
 *           type: boolean
 *         ContactPhoneNumber:
 *           type: string
 */

const VertexCertificateCoverageSchema = z.object({
  Jurisdiction: z.object({
    Country: z.string(),
    MainDivision: z.string().optional(),
  }),
  CertificateNumber: z.string().optional(),
  ReasonTypeName: z.string().optional(),
  EffectiveDate: z.string(),
  EndDate: z.string().optional(),
  IssueDate: z.string().optional(),
  ExpirationDate: z.string().optional(),
  ReviewDate: z.string().optional(),
});

const VertexCertificateImageSchema = z.object({
  ImageName: z.string(),
  ImageContent: z.string(),
});

const VertexCertCustomerSchema = z.object({
  customerClassIndicator: z.boolean().optional(),
  Code: z.string(),
  Name: z.string().optional(),
  OwningTaxpayer: z
    .object({
      CompanyCode: z.string(),
      DivisionCode: z.string().optional(),
      DepartmentCode: z.string().optional(),
      Name: z.string().optional(),
    })
    .optional(),
});

export const VertexCertificateSchema = z.object({
  Customer: VertexCertCustomerSchema,
  Coverages: z.array(VertexCertificateCoverageSchema),
  Images: z.array(VertexCertificateImageSchema).optional(),
  EffectiveDate: z.string(),
  EndDate: z.string().optional(),
  Note: z.string().optional(),
});

export const VertexCertificateSearchSchema = z.object({
  CertificateId: z.number().optional(),
  IncludeActiveIndicator: z.boolean().optional(),
  IncludeExpiredIndicator: z.boolean().optional(),
  IncludeExpiringIndicator: z.boolean().optional(),
  IncludeFutureIndicator: z.boolean().optional(),
  Jurisdiction: z.array(z.number()).optional(),
  MainDivision: z
    .array(
      z.object({
        IsoAlphaCountryCode: z.string(),
        MainDivisionName: z.string(),
        IncludeChildJurisdictionsIndicator: z.boolean().optional(),
      }),
    )
    .optional(),
  Taxpayer: z
    .array(
      z.object({
        CompanyCode: z.string(),
        DivisionCode: z.string().optional(),
        DepartmentCode: z.string().optional(),
        Name: z.string().optional(),
      }),
    )
    .optional(),
  CustomerCode: z.array(z.string()).optional(),
  Uuid: z.string().optional(),
  CertificateNumber: z.string().optional(),
  MinReviewDate: z.string().optional(),
  MaxReviewDate: z.string().optional(),
  MinExpirationDate: z.string().optional(),
  MaxExpirationDate: z.string().optional(),
  TransactionType: z.array(z.string()).optional(),
  CertificateScope: z.array(z.string()).optional(),
  ImpositionTypeName: z.string().optional(),
  UserDefinedImpositionTypeIndicator: z.boolean().optional(),
  ValidationStatus: z.string().optional(),
  ReplacedIndicator: z.boolean().optional(),
  ContactPhoneNumber: z.string().optional(),
});

export type VertexCertificate = z.infer<typeof VertexCertificateSchema>;
export type VertexCertificateSearch = z.infer<
  typeof VertexCertificateSearchSchema
>;
