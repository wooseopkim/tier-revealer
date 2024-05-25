import type { D1Database } from '@cloudflare/workers-types/experimental';
import { decodeJwt } from 'jose';

interface Params {
  database: D1Database;
  riotIdToken: string;
  dcinsideIdentificationCode: string;
}
export default async function connectDcinsideAccount({
  database,
  riotIdToken,
  dcinsideIdentificationCode,
}: Params) {
  const query = `
      INSERT INTO account_connections(riot_sub, connection_type, connection_data)
        VALUES(?, "dcinside", ?)
        ON CONFLICT(riot_sub, connection_type) DO UPDATE SET connection_data=excluded.connection_data;
    `
    .trim()
    .replace(/(\n|\s{2,})/g, '');
  const claims = decodeJwt(riotIdToken);
  const statement = database.prepare(query).bind(claims.sub!, dcinsideIdentificationCode);
  await statement.run();
}
