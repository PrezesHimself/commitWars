<script>
    import { releases } from '../store.js';
    import axios from 'axios';
    import { onMount } from 'svelte';
    import Releases from './Releases.svelte';

    let _releases;
    let names = 'Rorat,Adamik,Ligenzowski,Podmokly,Lipiec,obetkal,Susel,Wlodarczyk,Pater';

    const unsubscribe = releases.subscribe(value => {
        _releases = value;
    });

    onMount(async () => {
        handleCommits();
    });

    async function handleCommits() {
        const data = await Promise.all(names.split(',').map(name => name.trim()).map(name => axios.get(`api/commits/${name}`, {
            params: {
                startDate: 2018,
                endDate: 2020
            }
        })));

        const out =  _.compose(
                grouppedResults => {
                    const res = {};
                    Object.keys(grouppedResults).map(key => {
                        const formattedResult = {};
                        const tasksIds = _.map(_.unique(grouppedResults[key].reduce((sum, r) => sum.concat(r && r.tasks), [])), t => t && t.id);
                        const preparedTasks = _.map(tasksIds, taskId => {
                            return  _.chain(grouppedResults[key]).pluck('tasks').flatten().filter({id: taskId}).reduce((sum, value) => {
                                return !sum ? {...value, authors: [value.author]} : {...sum, authors: sum.authors.concat([value.author])}
                            }, null).value();
                        }).filter(task => !!task).map(task => {
                            const { author, ...noAuthor} = task;
                            return noAuthor
                        });
                        res[key] = {
                            tasksIds,
                            tasks: preparedTasks,
                            sumOfEstimates: preparedTasks.reduce((sum, task) => sum + task.estimate, 0),
                            sumOfCommits: preparedTasks.reduce((sum, task) => sum + task.commits.length, 0),
                            sumOfUniqFiles:  _.uniq(preparedTasks.reduce((sum, task) => sum.concat(task.filesChanged), [])).length,
                            sumOfFiles: preparedTasks.reduce((sum, task) => sum.concat(task.filesChanged), []).length,
                            extentionsChanged: (() => {
                                const res = _.chain(preparedTasks.reduce((sum, task) => sum.concat(task.extentionsChanged), []))
                                        .unique()
                                        .value();
                                return res.reduce((sum, result) => {
                                    const res = {};
                                    Object.keys(result).forEach(key => res[key] = result[key] + (sum[key] || 0));
                                    return {...sum, ...res};
                                }, {});
                            })(),
                            releaseName: key
                        };
                    });
                    return res;
                },
                filteredReleases => {
                    const result = {};
                    filteredReleases.map(release => result[release] = _.pluck(data.map(data => data.data.releases), release));
                    return result;
                },
                releases => releases.filter(release => !!release),
                _.uniq,
                releases => releases.reduce((sum, release) => sum.concat(release), []),
                data => data.map(data => data.data.releases).map(releases => Object.keys(releases))
        )(data);

        releases.set(
                Object.values(out)
        );
    }

    async function handleStatus() {
        const {data} = await axios.get('api/status');
        console.log(data)
    }
</script>

<style>
    .container {
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
    input {
        padding: 10px;
        width: 800px;
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,.2)
    }
</style>

<div class="container">
    <div>
        <input type="text"  bind:value={names}>
        <button on:click={handleCommits}>GO!</button>
    </div>

    <Releases releases={_releases}/>
</div>