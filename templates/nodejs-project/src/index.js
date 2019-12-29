const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const routes = require('./routes');

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use('/', routes);

app.set('port', process.env.PORT || 3001);

const server = app.listen(app.get('port'), () => {
  console.log(`Listening on port ${server.address().port}`);
});

module.exports = app;
