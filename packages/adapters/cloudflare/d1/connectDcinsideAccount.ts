import type D1Context from './D1Context';

interface Params {
  riotSub: string;
  dcinsideIdentificationCode: string;
}
export default async function connectDcinsideAccount(
  { database }: D1Context,
  { riotSub, dcinsideIdentificationCode }: Params,
) {
  const query = `
      INSERT INTO account_connections(riot_sub, connection_type, connection_data)
        VALUES(?, "dcinside", ?)
        ON CONFLICT(riot_sub, connection_type) DO UPDATE SET connection_data=excluded.connection_data;
    `
    .trim()
    .replace(/(\n|\s{2,})/g, '');
  const statement = database.prepare(query).bind(riotSub, dcinsideIdentificationCode);
  try {
    await statement.run();
  } catch (e: unknown) {
    return e as Error;
  }
}
