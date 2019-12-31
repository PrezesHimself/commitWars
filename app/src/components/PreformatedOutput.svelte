<script>
    export let output;
</script>

<style>
    pre {
        background: rgba(255,255,255, 0.2);
        padding: 10px;
        width: 50vw;
        overflow: auto;
    }
</style>

<pre>
    {JSON.stringify(output, null, 4)}
</pre>