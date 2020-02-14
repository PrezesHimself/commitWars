<script>
    import Task from './Task.svelte';
    export let release;
</script>

<style>
</style>

<div>
    <h3 style="margin-top: 20px;">Release {release.releaseName}</h3>
    <p>Sum of estimates: {release.sumOfEstimates} sum of commits: {release.sumOfCommits} sum of tasks: {release.tasks.length}</p>
    <hr>
    {#each release.tasks as task}
        <Task task={task}/>
    {/each}
</div>