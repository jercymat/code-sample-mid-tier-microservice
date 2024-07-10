import request from 'supertest';
import app from '..';

describe('1.1 Create Customer', () => {
  it('should return payload invalid error', async () => {
    const response = await request(app)
      .post('/api/customer')
      .send({}) // empty body
      .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: false,
      error: 'payload is invalid',
    });
  });

  it('should return 200 OK', async () => {
    const response = await request(app)
      .post('/api/customer')
      .send({
        CustomerKey: {
          customerClassIndicator: false,
          Code: '00000000',
          Name: 'Test Customer',
        },
        EffectiveDate: '2023-08-16',
        isExempt: false,
        Registrations: [
          {
            RegisteredJurisdiction: {
              Country: 'USA',
              MainDivision: 'Pennsylvania',
            },
          },
        ],
        Contacts: [
          {
            ContactClassification: 'BOTH',
            FirstName: 'John',
            LastName: 'Doe',
            StreetAddress: '250 Acme Street',
            StreetAddress2: 'Room 1201',
            City: 'Philadelphia',
            MainDivision: 'PA',
            PostalCode: '19103',
            Country: 'US',
            Department: 'Tax',
            PhoneNumber: '800-555-0155',
            FaxNumber: '800-555-0156',
            Email: '%owner_email%',
          },
        ],
      })
      .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(200);
  });

  it('should return 409 Conflict', async () => {
    const response = await request(app)
      .post('/api/customer')
      .send({
        CustomerKey: {
          customerClassIndicator: false,
          Code: '00000000',
          Name: 'Test Customer',
        },
        EffectiveDate: '2023-08-16',
        isExempt: false,
        Registrations: [
          {
            RegisteredJurisdiction: {
              Country: 'USA',
              MainDivision: 'PA',
            },
          },
        ],
        Contacts: [
          {
            ContactClassification: 'BOTH',
            FirstName: 'John',
            LastName: 'Doe',
            StreetAddress: '250 Acme Street',
            StreetAddress2: 'Room 1201',
            City: 'Philadelphia',
            MainDivision: 'PA',
            PostalCode: '19103',
            Country: 'US',
            Department: 'Tax',
            PhoneNumber: '800-555-0155',
            FaxNumber: '800-555-0156',
            Email: '%owner_email%',
          },
        ],
      })
      .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      status: false,
      error:
        'Error creating customer. Customer already exists for customer code [00000000], owning taxpayer [COMPANY_CODE] and customer class indicator [false].',
    });
  });
});

describe('1.2 Update Customer', () => {
  it('should return payload invalid error', async () => {
    const response = await request(app)
      .put('/api/customer')
      .send({}) // empty body
      .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: false,
      error: 'payload is invalid',
    });
  });

  it('should return 200 OK', async () => {
    const response = await request(app)
      .put('/api/customer')
      .send({
        CustomerKey: {
          customerClassIndicator: false,
          Code: '00000000',
          Name: 'Test Customer',
        },
        EffectiveDate: '2023-08-16',
        isExempt: false,
        Registrations: [
          {
            RegisteredJurisdiction: {
              Country: 'USA',
              MainDivision: 'Pennsylvania',
            },
          },
        ],
        Contacts: [
          {
            ContactClassification: 'BOTH',
            FirstName: 'John',
            LastName: 'Doe',
            StreetAddress: '250 Acme Street',
            StreetAddress2: 'Room 1201',
            City: 'Philadelphia',
            MainDivision: 'PA',
            PostalCode: '19103',
            Country: 'US',
            Department: 'Tax',
            PhoneNumber: '800-555-0155',
            FaxNumber: '800-555-0156',
            Email: '%owner_email%',
          },
        ],
      })
      .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(200);
  });
  it('should return 404 Not found', async () => {
    const response = await request(app)
      .put('/api/customer')
      .send({
        CustomerKey: {
          customerClassIndicator: false,
          Code: '00000000',
          Name: 'Test Customer',
        },
        EffectiveDate: '2023-08-16',
        isExempt: false,
        Registrations: [
          {
            RegisteredJurisdiction: {
              Country: 'USA',
              MainDivision: 'PA',
            },
          },
        ],
        Contacts: [
          {
            ContactClassification: 'BOTH',
            FirstName: 'John',
            LastName: 'Doe',
            StreetAddress: '250 Acme Street',
            StreetAddress2: 'Room 1201',
            City: 'Philadelphia',
            MainDivision: 'PA',
            PostalCode: '19103',
            Country: 'US',
            Department: 'Tax',
            PhoneNumber: '800-555-0155',
            FaxNumber: '800-555-0156',
            Email: '%owner_email%',
          },
        ],
      })
      .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      error:
        'Error updating customer. Customer does not exist for customer code [00000000], owning taxpayer [COMPANY_CODE] and customer class indicator [false].',
    });
  });
});
