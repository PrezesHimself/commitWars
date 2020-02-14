<script>
    import Release from './Release.svelte';
    export let releases;
</script>

<style>
    .releases {
        width: 80vw;
    }
</style>

<div class="releases">
    {#each releases as release}
        <Release release={release}/>
    {/each}
</div>