import { handleRequest } from './entry-server';

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  },
};
