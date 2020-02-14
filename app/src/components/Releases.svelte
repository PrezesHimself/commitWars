<script>
    import Release from './Release.svelte';
    export let releases;
</script>

<style>
</style>

<div>
    <div>
        {#each releases as release}
            <Release release={release}/>
        {/each}
    </div>
</div>