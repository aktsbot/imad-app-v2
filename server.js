var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/fortune', function (req, res) {
  res.sendFile(path.join(__dirname, 'fortune', 'index.html'));
});

app.get('/quote', function (req, res) {
  res.sendFile(path.join(__dirname, 'quote', 'index.html'));
});

// quote
app.get('/quote/css/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, '/quote/css/', 'style.css'));
});

app.get('/quote/js/script.js', function (req, res) {
  res.sendFile(path.join(__dirname, '/quote/js/', 'script.js'));
});

app.get('/quote/images/favicon.png', function (req, res) {
  res.sendFile(path.join(__dirname, '/quote/images/', 'favicon.png'));
});

app.get('/quote/js/quotes.json', function (req, res) {
  res.sendFile(path.join(__dirname, '/quote/js/', 'quotes.json'));
});
// end of quote

// fortune
app.get('/fortune/css/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, '/fortune/css/', 'style.css'));
});

app.get('/fortune/js/script.js', function (req, res) {
  res.sendFile(path.join(__dirname, '/fortune/js/', 'script.js'));
});

app.get('/fortune/js/fortunes.json', function (req, res) {
  res.sendFile(path.join(__dirname, '/fortune/js/', 'fortunes.json'));
});

app.get('/fortune/images/favicon.png', function (req, res) {
  res.sendFile(path.join(__dirname, '/fortune/images/', 'favicon.png'));
});
// end of fortune

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
