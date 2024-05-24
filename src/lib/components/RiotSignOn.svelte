<script lang="ts">
  import {
    PUBLIC_RIOT_SIGN_ON_CLIENT_ID,
    PUBLIC_RIOT_SIGN_ON_REDIRECT_URI,
  } from '$env/static/public';
  import cachedFetch from '$lib/cache/cachedFetch';
  import riotIdToken from '$lib/store/riotIdToken';
  import { onMount } from 'svelte';

  const signOnUrl = new URL('https://auth.riotgames.com');
  signOnUrl.pathname = 'authorize';
  const signOnParams = new URLSearchParams();
  signOnParams.set('client_id', PUBLIC_RIOT_SIGN_ON_CLIENT_ID);
  signOnParams.set('redirect_uri', PUBLIC_RIOT_SIGN_ON_REDIRECT_URI);
  signOnParams.set('response_type', 'code');
  signOnParams.set('scope', 'openid');
  signOnUrl.search = signOnParams.toString();

  let identity: Promise<Record<string, string>> = new Promise(() => {});

  onMount(() => {
    const params = new URLSearchParams(location.search);

    if (params.has('riot_id_token')) {
      localStorage.setItem('riotIdToken', params.get('riot_id_token')!);
    }

    riotIdToken.set(localStorage.getItem('riotIdToken'));
  });

  onMount(() => {
    riotIdToken.subscribe((value) => {
      if (value === undefined || value === null) {
        return;
      }

      // eslint-disable-next-line no-async-promise-executor
      identity = new Promise(async (resolve, reject) => {
        const url = '/api/riot/me';
        const fetch = cachedFetch({ url, ttl: 60 });
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        }).catch(reject);

        if (typeof res !== 'object') {
          reject();
          return;
        }

        if (!res.ok) {
          reject(res.statusText);
          riotIdToken.set(null);
          return;
        }

        const json = await res.json();
        resolve(json);
      });
    });
  });
</script>

{#if $riotIdToken === undefined}
  <progress />
{:else if $riotIdToken === null}
  <a href={signOnUrl.toString()}>Riot ID 연결</a>
{:else}
  {#await identity}
    <progress />
  {:then value}
    <span>{value.gameName} ({value.tier} {value.rank})</span>
  {/await}
{/if}
