const express = require('express');

const { exec } = require('child_process');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3001;
const path = require('path');
const cors = require('cors')
const apicache = require('apicache')
var cache = apicache.middleware

const api = require('./api/index');

app.use('/', router);
app.use(
    express.static(
        path.join(__dirname, '../app/public')
    )
);
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/public', 'index.html'))
});
router.use('/api', cache('1 hour'), api);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

Array.prototype.unique = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

module.exports = router;