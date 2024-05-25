<script lang="ts">
  import DcInsideBridge from '$lib/components/DCInsideBridge.svelte';
  import RiotSignOn from '$lib/components/RiotSignOn.svelte';
  import riotIdentity from '$lib/store/riotIdentity.js';
  import { onMount } from 'svelte';

  export let data;

  onMount(() => {
    riotIdentity.set(data.riotIdentity);
  });
</script>

<RiotSignOn />
<DcInsideBridge />
<div>{data.authChallenge}</div>
<div>{JSON.stringify(data.connections)}</div>
