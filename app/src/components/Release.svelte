<script>
    import Task from './Task.svelte';

    export let release;
</script>

<style>
</style>

<div>
    <h3 style="margin-top: 20px;">Release {release.releaseName}</h3>
    <p><strong>Sum of estimates:</strong> {release.sumOfEstimates} </p>
    <p><strong>sum of commits:</strong> {release.sumOfCommits}</p>
    <p><strong>sum of tasks:</strong> {release.tasks.length}</p>
    <p><strong>files changed:</strong> {release.sumOfUniqFiles}
    <p><strong>files extensions changed:</strong> {
            Object.keys(release.extentionsChanged)
                .sort((a, b) => {
                    return Number(release.extentionsChanged[a]) > Number(release.extentionsChanged[b])
                        ? -1 :
                            Number(release.extentionsChanged[a]) < Number(release.extentionsChanged[b]) ? 1 : 0
                            Number(release.extentionsChanged[a]) < Number(release.extentionsChanged[b]) ? 1 : 0
                })
                .map(key => `${key} ${ (release.extentionsChanged[key] / release.sumOfFiles * 100).toFixed(2) }% `)
                .join(' | ')
        }
    </p>
    <hr>
    {#each release.tasks as task}
        <Task task={task}/>
    {/each}
</div>