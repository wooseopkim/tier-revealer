export default function getRiotIdToken(request: Request) {
  const cookie = request.headers.get('Cookie');
  if (cookie === null) {
    return;
  }

  const riotIdToken = cookie
    .split('; ')
    .map((kv) => kv.split('=') as [string, string])
    .find(([k]) => k === 'riot_id_token')?.[1];
  return riotIdToken;
}
