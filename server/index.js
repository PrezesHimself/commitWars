const express = require('express');

const { exec } = require('child_process');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3001;
const path = require('path');
const exphbs  = require('express-handlebars');

const api = require('./api/index');

app.use('/', router);

router.use('/api', api);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

module.exports = router;