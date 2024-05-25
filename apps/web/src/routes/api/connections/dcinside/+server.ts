import connectAccount from '@tier-revealer/interactors/dcinside/connectAccount';
import getCookieValue from '@tier-revealer/lib/http/getCookieValue';

export async function POST({ request, platform }) {
  const riotIdToken = getCookieValue(request, 'riot_id_token');
  if (riotIdToken === undefined) {
    return new Response('', { status: 401 });
  }
  const { identificationCode } = await request.json();

  const error = await connectAccount(
    {
      namespace: platform!.env.KV_NAMESPACE_AUTH_CHALLENGES,
      database: platform!.env.D1_DB,
    },
    {
      riotIdToken,
      identificationCode,
    },
  );
  if (error !== undefined) {
    return Response.json(error, { status: 404 });
  }

  return Response.json({});
}
