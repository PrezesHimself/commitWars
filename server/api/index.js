const express = require('express');
const router = express.Router();
const {exec} = require('child_process');
const axios = require('axios');
const _ = require('underscore');
const rally = require('rally'),
    queryUtils = rally.util.query;

const restApi = rally({
    user: 'mateusz.rorat.ctr@sabre.com', //required if no api key, defaults to process.env.RALLY_USERNAME
    pass: process.env.PASS, //requi
});

const buffor = {maxBuffer: 1024 * 1024};

router.get('/clone', (req, res) => {
    exec(`sh bash/clone.sh ${process.env.REPO}`, buffor, (error, stdout, stderr) => {
        exec(`sh bash/status.sh`, buffor, (error, stdout, stderr) => {
            res.send(stderr || stdout);
        });
    });
});

router.get('/status', (req, res) => {
    exec(`sh bash/status.sh ${process.env.EXISTING_REPO}`, buffor, (error, stdout, stderr) => {
        res.send(stderr || stdout);
    });
});


router.get('/fetch', (req, res) => {
    exec(`sh bash/fetch.sh ${process.env.EXISTING_REPO}`, buffor, (error, stdout, stderr) => {
        res.send(stderr || stdout);
    });
});


router.get(
    '/commits/:name',
    async (req, res) => {
        const {exec} = require('child_process');
        const {startDate = '', endDate = ''} = req.query;
        const result = await new Promise(resolve => {
            exec(`sh bash/commitWars.sh ${process.env.EXISTING_REPO || 'C:\\SabreDeveloper\\srw'} "${req.params.name}" ${startDate} ${endDate}`,
                buffor,
                async (error, stdout, stderr) => {
                    const result = {
                        commits: []
                    };
                    const data = stdout.split('ŶŶŶŶ');

                    if (stderr) return res.send(stderr);

                    for (let i = 1; i < data.length; i += 5) {
                        const commit = {
                            sha: data[i].replace(/[\n\r]/g, ' '),
                            date: data[i + 2],
                            message: data[i + 3],
                            author: data[i + 1],
                            files: data[i + 4].trim().split(' '),
                            rallyId: ((data[i + 3] || '').match(/US\d{4,}|DE\d{4,}/gi) || [])[0]
                        };
                        console.log(commit);
                        result.commits.push(commit);
                    }

                    result.rally = await Promise.all(result.commits.map(commit => commit.rallyId).unique().filter(rally => !!rally).map(
                        async ticket => {
                            try {
                                const rallyData = await restApi.query({
                                    type: (ticket + '').startsWith('DE') ? 'defect' : 'hierarchicalrequirement', //the type to query
                                    fetch: ['FormattedID', 'PlanEstimate', 'Release'], //the fields to retrieve
                                    query: queryUtils.where('FormattedId', '=', ticket), //optional filter
                                    scope: {},
                                    requestOptions: {} //optional additional options to pass through to request
                                });
                                return rallyData.Results[0];
                            } catch (error) {
                                console.log(error)
                                res.send(error)
                            }
                        }
                    ));

                    const mappedResults = result.rally.filter(rally => rally).map(
                        rally => {
                            const filesChanged = _.map(result.commits, 'files').reduce((sum, files) => sum.concat(files), []);
                            return {
                                release: rally.Release ? rally.Release._refObjectName : '',
                                    id: rally.FormattedID,
                                description: rally.Description,
                                commits: result.commits.filter(commit => commit.rallyId === rally.FormattedID),
                                filesChanged,
                                extentionsChanged: _.uniq(filesChanged.map(file => file.split('.').pop())),
                                estimate: rally.PlanEstimate,
                                link: 'https://rally1.rallydev.com/#/search?keywords=' + rally.FormattedID,
                                author: req.params.name,
                            }
                        }
                    );
                    resolve(_.groupBy(mappedResults, 'release'));
                });
        });

        const releases = {};

        Object.keys(result).forEach(key => {
            releases[key] = {
                tasks: result[key],
                estimationsSum: result[key].reduce((sum, task) => sum + task.estimate, 0),
                commitsSum: result[key].reduce((sum, task) => sum + task.commits.length, 0),
            }
        });

        res.json({
            name: req.params.name,
            releases,
        });
    });

module.exports = router;