var express = require('express');

var server_port = 8080;
var server_ip_address = '127.0.0.1';

var app = express();
app.use(express.static('public'));
// app.use('/status', express.static('status'));

app.listen(server_port, server_ip_address, function () {
  console.log('Listening at http://%s:%s', server_ip_address, server_port);
});
