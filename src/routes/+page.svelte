<script lang="ts">
  import RiotSignOn from '$lib/components/RiotSignOn.svelte';
  import riotIdToken from '$lib/store/riotIdToken.js';
  import { onMount } from 'svelte';

  export let data;

  onMount(() => {
    if (data.riotIdToken === undefined) {
      return;
    }

    riotIdToken.set(data.riotIdToken);
  });
</script>

<RiotSignOn />
