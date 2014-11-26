var express = require('express');
var useragent = require('useragent');
var app = express();

useragent(true);

app.use(function (req, res, next) {
  var agent = useragent.parse(req.headers['user-agent']);
  req.joola_event = {
    timestamp: new Date(),
    event: 'request',
    agent: agent,
    os: agent.os,
    device: agent.device,
    ip: req.ip,
    path: req.path
  };

  return next();
});

app.get('/', function (req, res, next) {
  res.send('hello world');
  return next();
});

app.use(function (req, res, next) {
  req.joola_event.duration_ms = new Date().getTime() - req.joola_event.timestamp.getTime();
  console.log(req.joola_event);
  res.end();
  return next();
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port)
});