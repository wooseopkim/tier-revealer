import type D1Context from './D1Context';

interface Params {
  riotSub: string;
}

export default async function getAccountConnections({ database }: D1Context, { riotSub }: Params) {
  const query =
    'SELECT connection_type, connection_data, updated_at FROM account_connections WHERE riot_sub = ?';
  const statement = database.prepare(query).bind(riotSub);
  const { results, error } = await statement.all();
  return { results, error };
}
