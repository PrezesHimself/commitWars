<script>
    export let task;
</script>

<style>
</style>

<div>
    <a href="{task.link}">{task.id}</a>: {task.authors.join(', ')}
    --- {
            Object.keys(task.extentionsChanged)
                .sort((a, b) => {
                    return Number(task.extentionsChanged[a]) > Number(task.extentionsChanged[b])
                    ? -1 :
                    Number(task.extentionsChanged[a]) < Number(task.extentionsChanged[b]) ? 1 : 0
                    Number(task.extentionsChanged[a]) < Number(task.extentionsChanged[b]) ? 1 : 0
                })
                .map(key => `${key} ${ (task.extentionsChanged[key] / task.filesChanged.length * 100).toFixed(2) }% `)
                .join(' | ')} <br>
    --- <strong>FE:</strong> {task.feModules.join(', ')}<br>
    --- <strong>BE:</strong> {task.bePackages.join(', ')}<br>
</div>