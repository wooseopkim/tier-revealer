import type D1Context from './D1Context';

interface Params {
  puuid: string;
  dcinsideIdentificationCode: string;
}
export default async function connectDcinsideAccount(
  { database }: D1Context,
  { puuid, dcinsideIdentificationCode }: Params,
) {
  const query = `
      INSERT INTO account_connections(puuid, connection_type, connection_data)
        VALUES(?, "dcinside", ?)
        ON CONFLICT(puuid, connection_type) DO UPDATE SET connection_data=excluded.connection_data;
    `
    .trim()
    .replace(/(\n|\s{2,})/g, '');
  const statement = database.prepare(query).bind(puuid, dcinsideIdentificationCode);
  try {
    await statement.run();
  } catch (e: unknown) {
    return e as Error;
  }
}
