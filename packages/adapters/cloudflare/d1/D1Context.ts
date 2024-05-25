import { D1Database } from '@cloudflare/workers-types';

export default interface D1Context {
  database: D1Database;
}
