var express = require('express');
var app = express();


let listData = [
    {
        key: '0',
        account: '18736473823',
        startTime: '2007-02-20 17:20:30',
        endTime: '2007-02-20 20:20:30',
        status: 0,
        message: {
        }
    },
    {
        key: '1',
        account: '15067378467',
        startTime: '2007-02-20 17:00:30',
        endTime: '2007-02-20 17:20:30',
        status: 1,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    },
    {
        key: '2',
        account: '18736473823',
        startTime: '2007-02-20 17:20:30',
        endTime: '2007-02-20 20:20:30',
        status: 0,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    },
    {
        key: '3',
        account: '15067378467',
        startTime: '2007-02-20 17:00:30',
        endTime: '2007-02-20 17:20:30',
        status: 2,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    },
    {
        key: '4',
        account: '18736473823',
        startTime: '2007-02-20 17:20:30',
        endTime: '2007-02-20 20:20:30',
        status: 1,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    },
    {
        key: '5',
        account: '15067378467',
        startTime: '2007-02-20 17:00:30',
        endTime: '2007-02-20 17:20:30',
        status: 2,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    },
    {
        key: '6',
        account: '18736473823',
        startTime: '2007-02-20 17:20:30',
        endTime: '2007-02-20 20:20:30',
        status: 0,
        message: {
        }
    },
    {
        key: '7',
        account: '15067378467',
        startTime: '2007-02-20 17:00:30',
        endTime: '2007-02-20 17:20:30',
        status: 1,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    },
    {
        key: '8',
        account: '18736473823',
        startTime: '2007-02-20 17:20:30',
        endTime: '2007-02-20 20:20:30',
        status: 0,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    },
    {
        key: '9',
        account: '15067378467',
        startTime: '2007-02-20 17:00:30',
        endTime: '2007-02-20 17:20:30',
        status: 2,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    },
    {
        key: '10',
        account: '18736473823',
        startTime: '2007-02-20 17:20:30',
        endTime: '2007-02-20 20:20:30',
        status: 1,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    },
    {
        key: '11',
        account: '15067378467',
        startTime: '2007-02-20 17:00:30',
        endTime: '2007-02-20 17:20:30',
        status: 2,
        message: {
            mirrorTotal: 1002,
            billTotal: 9998
        }
    }
];

// 设置跨域访问，方便开发
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// 具体接口设置
app.post('/dial/api/customer/find/list', function(req, res) {
    setTimeout(function () {
        res.send({ code: 200, data: listData });
    },1000)
});

app.post('/dial/api/customer/find/list/history', function(req, res) {
    setTimeout(function () {
        res.send({ code: 200, data: listData });
    },1000)
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Mock server listening at http://%s:%s', host, port);
});