<script lang="ts">
  import RiotSignOn from '$lib/components/RiotSignOn.svelte';
  import riotIdentity from '$lib/store/riotIdentity.js';
  import { onMount } from 'svelte';

  export let data;

  onMount(() => {
    riotIdentity.set(data.riotIdentity);
  });
</script>

<RiotSignOn />
