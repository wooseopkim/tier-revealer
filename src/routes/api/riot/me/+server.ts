import { RIOT_API_KEY } from '$env/static/private';
import { decodeJwt } from 'jose';

export async function GET({ request, platform }) {
  const idToken = request.headers.get('Authorization')?.replace(/^Bearer /, '');

  if (idToken === null || idToken === undefined) {
    return new Response('', { status: 403 });
  }

  const claims = decodeJwt(idToken);
  const tokens = await platform?.env.KV_NAMESPACE_RIOT_TOKENS.get(claims.sub!);

  if (tokens === undefined || tokens === null) {
    return new Response('', { status: 404 });
  }
  const { access_token: accessToken } = JSON.parse(tokens);

  const [summoner, account] = await Promise.all(
    [
      fetch('https://kr.api.riotgames.com/tft/summoner/v1/summoners/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((x) => x.json())
        .then(({ id }) =>
          fetch(`https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}`, {
            headers: {
              'X-Riot-Token': RIOT_API_KEY,
            },
          }),
        ),
      fetch('https://asia.api.riotgames.com/riot/account/v1/accounts/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ].map(async (x) => (await x).json()),
  );
  const { tier, rank } = summoner[0];
  const { gameName } = account;
  return new Response(
    JSON.stringify({
      tier,
      rank,
      gameName,
    }),
  );
}
