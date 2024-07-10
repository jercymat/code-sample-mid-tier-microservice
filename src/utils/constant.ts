import { VERTEX_PASSWORD, VERTEX_USERNAME } from './config';

const VERTEX_API_SYSTEM_CONTEXT = {
  Login: {
    UserName: VERTEX_USERNAME,
    Password: VERTEX_PASSWORD,
  },
  AsOfDate: new Date().toISOString().slice(0, 10),
  Perspective: 'SUPPLIES',
  // MaximumSearchResults: 36,
};

export default { VERTEX_API_SYSTEM_CONTEXT };
