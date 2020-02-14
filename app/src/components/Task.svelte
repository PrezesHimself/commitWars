<script>
    export let task;
</script>

<style>
</style>

<div>
    <a href="{task.link}">{task.id}</a>: {task.authors.join(', ')} --- {task.extentionsChanged}
</div>