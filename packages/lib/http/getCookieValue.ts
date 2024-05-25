export default function getCookieValue(request: Request, key: string) {
  const cookie = request.headers.get('Cookie');
  if (cookie === null) {
    return;
  }

  const value = cookie
    .split('; ')
    .map((kv) => kv.split('=') as [string, string])
    .find(([k]) => k === key)?.[1];
  return value;
}
