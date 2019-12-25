const express = require('express');

const { exec } = require('child_process');
const app = express();
const port = 3001;
const path = require('path');
const exphbs  = require('express-handlebars');
require('dotenv').config()

const buffor = {maxBuffer: 1024 * 1024};

app.get('/', (req, res) => {
    exec(`sh bash/status.sh`, buffor, (error, stdout, stderr) => {
        res.render(path.resolve(__dirname + '/../views/index.hbs'), { output: stdout});
    });
});

app.get('/clone', (req, res) => {

    if(!process.env.REPO) {
        res.render(path.resolve(__dirname + '/../views/index.hbs'), { output: `
            Please set REPO enviromental variable in ./.env base on 
            ./.env.sample
        `});
        return
    }
    exec(`sh bash/clone.sh ${process.env.REPO}`, buffor, (error, stdout, stderr) => {
        exec(`sh bash/status.sh`, buffor, (error, stdout, stderr) => {
            res.render(path.resolve(__dirname + '/../views/index.hbs'), { output: stdout});
        });
    });
});

app.get('/reset', (req, res) => {
    exec(`sh bash/reset.sh`, buffor, (error, stdout, stderr) => {
        exec(`sh bash/status.sh`, buffor, (error, stdout, stderr) => {
            res.render(path.resolve(__dirname + '/../views/index.hbs'), { output: stdout});
        });
    });
});

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.get(
    '/commits/:name',
    async (req, res) => {
    const { exec } = require('child_process');
    const {startDate = '', endDate = ''} = req.query;
    const result = await new Promise(resolve => {
        exec(`sh bash/commitWars.sh ${req.params.name} ${startDate} ${endDate}`, {maxBuffer: 1024 * 5000}, async (error, stdout, stderr) => {

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
            delete result.commits['undefined'];

            resolve({
                [req.params.name]: result
            });
        });
    })
    res.json(result);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))