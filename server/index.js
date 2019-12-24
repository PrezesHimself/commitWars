const express = require('express');
const axios = require('axios');
const apicache = require('apicache');
const app = express();
const port = 3001;
var path = require('path');

const cache = apicache.middleware;

// app.use(cache('1 hour'))

app.get('/', async (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../app/index.html'));
})
axios.defaults.withCredentials = true;

Array.prototype.unique = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

app.get(
    '/commits/:name',
    async (req, res) => {
    const { exec } = require('child_process');
    const {startDate = '', endDate = ''} = req.query;
    const result = await new Promise(resolve => {
        exec(`sh bash/commitWars.sh ${req.params.name} ${startDate} ${endDate}`, {maxBuffer: 1024 * 5000}, async (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            const result = {
                commits: [],
                rally: []
            };
            const data = stdout.split('Ŷ');

            for (let i = 0; i < data.length; i+=4) {
                result.commits.push({
                    sha: data[i].replace(/[\n\r]/g,' '),
                    date: data[i + 2],
                    message: data[i + 3],
                    author: data[i + 1],
                    rally: ((data[i + 3] + '').match(
                        new RegExp('(US|DE)[0-9]{6}', 'g')
                    ) || [])[0]
                });
            }
            delete result.commits['undefined'];

            result.rally = await Promise.all(result.commits.map(commit => commit.rally).unique().filter(rally => !!rally).map(
                async ticket => {
                    let fetchURL = 'https://rally1.rallydev.com/slm/webservice/v2.0/';
                    if ((ticket + '').startsWith('DE')) {
                        fetchURL += 'defect';
                    } else {
                        fetchURL += 'hierarchicalrequirement';
                    }
                    fetchURL += `?query=(FormattedID%20=%20${ticket})`;
                    fetchURL += '&fetch=true';
                    const rallyData = await axios.get(
                        fetchURL,
                        {
                            headers: {
                                Cookie: "__cfduid=d81cf7e538f21de5c2d4e3849c366ace51564757354; perm-login-locale=en-US; SERVERID=6a893f3bbff4a27719ff8d7b1ccb76f5b3f7457d; SUBBUCKETID=391; SUBSCRIPTIONID=61391; __cflb=3719710600; JSESSIONID=gc-app-0613m3zpxrm6n4x1c74p7battfxo.gc-app-06; ZSESSIONID=AJAsdqaHTD3lmmtYFhPYfRzDCU7EvrosRy8SVO0C8; QSI_HistorySession=https%3A%2F%2Frally1.rallydev.com%2F%23%2F290930426388d%2Fdetail%2Fuserstory%2F299077853340~1577179129420"
                            }
                        }
                    );
                    try {
                        return rallyData.data.QueryResult.Results[0];
                    } catch(error) {
                        console.log(error)
                    }
                }
            ));

            resolve({
                [req.params.name]: result
            });
        });
    })
    res.json(result);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))