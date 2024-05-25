<script lang="ts">
  import DcInsideBridge from '$lib/components/DCInsideBridge.svelte';
  import RiotSignOn from '$lib/components/RiotSignOn.svelte';

  export let data;
</script>

<RiotSignOn riotIdentity={data.riotIdentity} />
<DcInsideBridge />
<div>{data.authChallenge}</div>
<div>{JSON.stringify(data.connections)}</div>
