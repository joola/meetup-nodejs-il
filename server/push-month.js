var joola = require('joola.sdk');

var browsers = ['Chrome', 'Firefox', 'Opera'];
var device = ['Desktop', 'Mobile', 'Tablet', 'Other'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

joola.init({host: 'http://localhost:8080', APIToken: 'apitoken-demo'});
joola.on('ready', function () {
  var current = new Date();
  var start = new Date();
  start.setDate(start.getDate() - 31);
  while (current > start) {
    var event = {
      timestamp: current.toISOString(),
      event: 'request',
      agent: {
        family: browsers[getRandomInt(0, browsers.length - 1)],
        major: '39',
        minor: '0',
        patch: '2171'
      },
      os: { family: 'Linux', major: '0', minor: '0', patch: '0' },
      device: { family: device[getRandomInt(0, device.length - 1)], major: '0', minor: '0', patch: '0' },
      ip: '127.0.0.1',
      path: '/',
      count: getRandomInt(1, 30),
      duration_ms: getRandomInt(1, 5)
    };
    joola.insert('requests', event);
    current.setDate(current.getDate() - 1);
  }
});