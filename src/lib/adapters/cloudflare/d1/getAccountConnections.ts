import type { D1Database } from '@cloudflare/workers-types/experimental';
import { decodeJwt } from 'jose';

interface Params {
  database: D1Database;
  riotIdToken: string;
}

export default async function getAccountConnections({ database, riotIdToken }: Params) {
  const claims = decodeJwt(riotIdToken);
  const query =
    'SELECT connection_type, connection_data, updated_at FROM account_connections WHERE riot_sub = ?';
  const statement = database.prepare(query).bind(claims.sub!);
  const { results, error } = await statement.all();
  return { results, error };
}
