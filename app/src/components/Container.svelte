<script>
    import { output } from '../store.js';
    import axios from 'axios';
    import { onMount } from 'svelte';
    import PreformatedOutput from './PreformatedOutput.svelte';

    let _output;
    let names = 'rorat, susel';
    let release = 'SR360 20.2';

    const unsubscribe = output.subscribe(value => {
        _output = value;
    });

    onMount(async () => {
        handleStatus();
    });

    async function handleCommits() {
        const data = await Promise.all(names.split(',').map(name => name.trim()).map(name => axios.get(`api/commits/${release}/${name}`, {
            params: {
                startDate: 2018,
                endDate: 2020
            }
        })));
        console.log(data);
        output.set(
            data.map(data => data.data)
                    .map(data => `${data.name}: estimate sum: ${data.estimateSum}`)
        );
    }

    async function handleStatus() {
        const {data} = await axios.get('api/status');
        output.set(data);
    }
</script>

<style>
    .container {
        flex: 0 1 80vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    button {
        padding: 10px;
        border: none;
        outline: none;
        font: inherit;
        color: inherit;
        background: none;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid rgba(255,255,255,.2);
    }
</style>

<div class="container">
    <div>
        <button on:click={handleStatus}>status</button>
        |
        <input type="text"  bind:value={names}>
        <input type="text"  bind:value={release}>
        <button on:click={handleCommits}>commits</button>
    </div>
    <div>
        <PreformatedOutput output={_output}/>
    </div>
</div>