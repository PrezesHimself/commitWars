const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

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
        const { exec } = require('child_process');
        const {startDate = '', endDate = ''} = req.query;
        const result = await new Promise(resolve => {
            exec(`sh bash/commitWars.sh ${process.env.EXISTING_REPO} ${req.params.name} ${startDate} ${endDate}`, buffor, async (error, stdout, stderr) => {
                const result = {
                    commits: []
                };
                const data = stdout.split('Ŷ');
                console.log(data.length)
                if(stderr) return res.send(stderr);

                for (let i = 0; i < data.length; i+=4) {
                    result.commits.push({
                        sha: data[i].replace(/[\n\r]/g,' '),
                        date: data[i + 2],
                        message: data[i + 3],
                        author: data[i + 1],
                        rally: (data[i + 3] || '').match(/US\d{4,}|DE\d{4,}/gi)
                    });
                }

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
                                    Cookie: "__cfduid=d81cf7e538f21de5c2d4e3849c366ace51564757354; perm-login-locale=en-US; ZSESSIONID=IFvcf6x2RzC5IBd8LT5i5GBTNiNUBnrOkNDsh3858; __cflb=02DiuGt7Pa96k7m2pbYDQ3JqxN9fyiuCTofF21HfPPfPa; JSESSIONID=gc-app-19ey9rgdd7mpdl6vbhtq6yl7he.gc-app-19; SUBBUCKETID=391; SUBSCRIPTIONID=61391; SERVERID=1f05018cd0885e66f7f9cb4067429b0722b672b9; QSI_HistorySession=https%3A%2F%2Frally1.rallydev.com%2F%23%2F290930426388d%2Fdetail%2Fdefect%2F360576610224~1580126980440%7Chttps%3A%2F%2Frally1.rallydev.com%2F%23%2F290930426388d%2Fdetail%2Fuserstory%2F356057887120~1580127077237%7Chttps%3A%2F%2Frally1.rallydev.com%2F%23%2F290930426388d%2Fdashboard~1580136159599%7Chttps%3A%2F%2Frally1.rallydev.com%2F%23%2F290930426388d%2Fdetail%2Fdefect%2F361309643096~1580136261089%7Chttps%3A%2F%2Frally1.rallydev.com%2F%23%2F290930426388d%2Fdetail%2Fuserstory%2F362424128848~1580136381463"}
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
        });
        res.json(result);
    });

module.exports = router;