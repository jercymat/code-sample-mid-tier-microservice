import { LDAP_CON, LDAP_DN } from './config';
import ldap from 'ldapjs';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ServiceAccount:
 *       type: http
 *       scheme: basic
 */

export const adLogin = async (username: string, password: string) => {
  const ldapCon = LDAP_CON || '';
  const ldapDN = LDAP_DN || '';

  if (!ldapCon) {
    throw new Error('No LDAP_CON specified');
  }
  if (ldapCon == 'DNU') {
    return { U: 'DNU' };
  }

  try {
    const userPrincipal = username + '@' + ldapDN;
    const adClient = ldap.createClient({
      url: ldapCon,
      tlsOptions: { rejectUnauthorized: false },
    });

    return new Promise<{ U: string }>((resolve, reject) => {
      adClient.bind(userPrincipal, password, e => {
        if (e) {
          adClient.destroy();

          // @ts-ignore
          if (e.lde_message == 'Invalid Credentials') {
            reject(`INVALID CREDENTIAL: User ID: ${userPrincipal}`);
          }

          reject(`Other LDAP Error: ${JSON.stringify(e)}`);
        }

        adClient.destroy();
        resolve({ U: username });
      });
    });
  } catch (err: unknown) {
    throw new Error(`Error: ${err}`);
  }
};
