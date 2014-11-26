var express = require('express');
var useragent = require('useragent');
var joola = require('joola.sdk');
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
    path: req.path,
    count: 1
  };

  return next();
});

app.get('/', function (req, res, next) {
  res.send('hello world');
  return next();
});

app.use(function (req, res, next) {
  req.joola_event.duration_ms = new Date().getTime() - req.joola_event.timestamp.getTime();

  joola.insert('requests', req.joola_event, function (err, result) {
    if (err)
      throw err;
    console.log(result);
    res.end();
    return next();
  });
});

joola.init({host: 'http://localhost:8080', APIToken: 'apitoken-demo'}, function (err) {
  if (err)
    throw err;
  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)
  });
});
  