import xml2js from 'xml2js';

const builder = new xml2js.Builder({
  xmldec: { version: '1.0', encoding: 'UTF-8' },
});

export const getSoapRequestXML = (payload: object) =>
  builder.buildObject({
    'soap:Envelope': {
      $: {
        'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      },
      'soap:Body': payload,
    },
  });

export const testXML = (payload: object) => builder.buildObject({ ...payload });
