var app = require('../app');

app.get('*', function (req, res) {
    res.send('Hello World!');
});