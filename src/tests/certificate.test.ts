import request from 'supertest';
import app from '..';

describe('2.1 Create Certificate', () => {
  it('should return payload invalid error', async () => {
    const response = await request(app)
      .post('/api/certificate')
      .send({}) // empty body
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: false,
      error: 'payload is invalid',
    });
  });

  it('should return 200 OK', async () => {
    const response = await request(app)
      .post('/api/certificate')
      .send({
        Customer: {
          customerClassIndicator: false,
          Code: '00000000',
          Name: 'Test Customer',
        },
        Coverages: [
          {
            Jurisdiction: {
              Country: 'US',
              MainDivision: 'West Virginia',
            },
            CertificateNumber: 'SEE CERT',
            ReasonTypeName: 'Resale',
            EffectiveDate: '2023-08-20',
            IssueDate: '2023-08-20',
            ExpirationDate: '9999-12-31-06:00',
          },
        ],
        Images: [
          {
            ImageName: 'x.pdf',
            ImageContent: '',
          },
        ], // optional
        EffectiveDate: '2023-08-20',
        EndDate: '9999-12-31', // optional
        Note: 'some notes', // optional
      }) // empty body
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  });
});

describe('2.2 Find Certificates', () => {
  it('should return payload invalid error', async () => {
    const response = await request(app)
      .post('/api/certificate/find')
      .send({}) // empty body
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: false,
      error: 'payload is invalid',
    });
  });

  it('should return 200 OK', async () => {
    const response = await request(app)
      .post('/api/certificate/find')
      .send({
        CustomerCode: ['00000000'],
      })
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  });
});
