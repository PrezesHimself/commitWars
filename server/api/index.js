const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

const buffor = {maxBuffer: 1024 * 1024};

router.get('/clone', (req, res) => {

    if(!process.env.REPO) {
        res.render('index.hbs', { output: `
            export REPO=git://repo.com
        `});
        return
    }
    exec(`sh bash/clone.sh ${process.env.REPO}`, buffor, (error, stdout, stderr) => {
        exec(`sh bash/status.sh`, buffor, (error, stdout, stderr) => {
            res.send(stderr || stdout);
        });
    });
});

router.get('/status', (req, res) => {
    exec(`sh bash/status.sh`, buffor, (error, stdout, stderr) => {
        res.send(stderr || stdout);
    });
});

router.get(
    '/commits/:name',
    async (req, res) => {
        const { exec } = require('child_process');
        const {startDate = '', endDate = ''} = req.query;
        const result = await new Promise(resolve => {
            exec(`sh bash/commitWars.sh ${req.params.name} ${startDate} ${endDate}`, buffor, async (error, stdout, stderr) => {
                const result = {
                    commits: []
                };

                const data = stdout.split('Ŷ');

                for (let i = 0; i < data.length; i+=4) {
                    result.commits.push({
                        sha: data[i].replace(/[\n\r]/g,' '),
                        date: data[i + 2],
                        message: data[i + 3],
                        author: data[i + 1]
                    });
                }

                resolve({
                    [req.params.name]: result
                });
            });
        });
        res.json(result);
    });

module.exports = router;