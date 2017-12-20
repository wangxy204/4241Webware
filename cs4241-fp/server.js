var express = require('express');
var app = require('express')();
var path = require('path');
var fs = require("fs");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sqlite3 = require('sqlite3').verbose();
var file = "user.db";
var db = new sqlite3.Database(file);
var port_number = process.env.PORT || 3000;

db.serialize(function() {
    db.run("DROP TABLE IF EXISTS users");
    db.run("CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE, password TEXT, friends TEXT, requests TEXT)");
    // for testing
    db.run("INSERT INTO users (username, password, friends, requests) VALUES ('a', 'a', ?, ?)", [JSON.stringify([]), JSON.stringify([])]);
    db.run("INSERT INTO users (username, password, friends, requests) VALUES ('b', 'b', ?, ?)", [JSON.stringify([]), JSON.stringify([])]);
    db.run("INSERT INTO users (username, password, friends, requests) VALUES ('c', 'c', ?, ?)", [JSON.stringify([]), JSON.stringify([])]);
});

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/semantic/out/semantic.min.js',function (req, res) {
    res.sendFile(path.join(__dirname, '/semantic/out/semantic.min.js'));
})

app.get('/semantic/out/semantic.min.css', function (req, res) {
    res.sendFile(path.join(__dirname, '/semantic/out/semantic.min.css'));
})

app.get('/semantic/out/themes/default/assets/fonts/icons.woff2', function (req, res) {
    res.sendFile(path.join(__dirname, '/semantic/out/themes/default/assets/fonts/icons.woff2'));
})

function User(username, password, socketID) {
    this.username = username;
    this.password = password;
    this.socketID = socketID;
    this.friends = [];
    this.requests = [];
}

function LogInInfo(username, msg) {
    this.username = username;
    this.msg = msg;
}

function addInfo(request_from, request_to) {
    this.request_from = request_from;
    this.request_to = request_to;
}

function updateListInfo(username, friend_list) {
    this.username = username;
    this.friend_list = friend_list;
}

function room(user_from, user_to, room_num) {
    this.user_from = user_from;
    this.user_to = user_to;
    this.room_num= room_num;
}

var onLineUser = [];
var rooms = [];
var onLineFlag = false;
var foundFlag = false;
var ifExistFlag = false;
var ifFriendFlag = false;
var roomExistsFlag = false;

io.on('connection', function(socket){
    socket.on('register', function(msg){
        var user = new User(msg.username, msg.password, socket.id);

        db.run("INSERT INTO users (username, password, friends, requests) VALUES (?, ?, ?, ?)", [user.username, user.password, JSON.stringify(user.friends), JSON.stringify(user.requests)], function (err) {
            if (err) {
                socket.emit('register', 'fail');
            } else {
                socket.emit('register', 'success');
            }
        })
    });

    socket.on('login', function(msg) {
        var tryLoginData = new User(msg.username, msg.password, socket.id);
        var info = new LogInInfo('', '');
        var temp = new User('', '', '');

        db.each('SELECT * FROM users WHERE username = ?', tryLoginData.username, function (err, data) {
            temp.username = data.username;
            temp.password = data.password;
        }, function () {

            if (temp.username == '') {
                info.msg = 'not exist';
                socket.emit('login', info);
            } else if (temp.password == tryLoginData.password) {

                for (var i = 0; i < onLineUser.length; i++) {
                    if (onLineUser[i] == tryLoginData.username) {
                        info.msg = 'already logged in';
                        socket.emit('login', info);
                        onLineFlag = true;
                    }
                }

                if (onLineFlag == false) {
                    onLineUser.push(tryLoginData.username);
                    info.msg = 'success';
                    info.username = tryLoginData.username;
                    socket.emit('login', info);
                }

                onLineFlag=false;

            } else {
                info.msg = 'wrong password';
                socket.emit('login', info);
            }
        });
    });

    socket.on('send-in-public', function (msg) {
        io.emit('show-in-public', msg);
    })

    socket.on('update-online-panel', function (msg) {
        io.emit('update-online-list', onLineUser);
    })

    socket.on('update-log-out', function (msg) {
        var temp = [];

        for (var i = 0; i < onLineUser.length; i++) {
            if (onLineUser[i] != msg) {
                temp.push(onLineUser[i]);
            }
        };

        onLineUser = temp;

        io.emit('update-online-list', onLineUser);
    })

    socket.on('show-friends-list-when-log-in', function (msg) {
        db.each('SELECT * FROM users WHERE username = ?', msg, function (err, data) {
            socket.emit('update-friends-list', JSON.parse(data.friends));
        })
    })

    socket.on('request-to-add', function (msg) {
        db.each('SELECT * FROM users WHERE username = ?', msg.request_to, function (err, data) {
            foundFlag = true;

            var friends = JSON.parse(data.friends);
            for (var i = 0; i < friends.length; i++) {
                if (friends[i] == msg.request_from) {
                    socket.emit('already friends', msg.request_to);
                }
            };

            socket.emit('request-sent', '');

            for (var i = 0; i < onLineUser.length; i++) {
                if (onLineUser[i] == msg.request_to) {
                    io.emit('receive request', msg);
                }
            };

            //not on line handle///////////////??????????????????????????????????????/

        }, function () {

            if (foundFlag == false) {
                socket.emit('error-handle-add', '');
            }

            foundFlag = false;
        })
    })

    socket.on('i reject', function (msg) {
        io.emit('he reject', msg);
    })

    socket.on('i agree', function (msg) {

        // console.log('here!!')
        // console.log('check message')
        // console.log('b also received?')
        // console.log(msg)
        io.emit('he agree', msg);

        db.serialize(function () {
            db.each('SELECT * FROM users WHERE username = ?', msg.request_from, function (err, data) {

                var friends_list = JSON.parse(data.friends);
                // console.log(friends_list)
                friends_list.push(msg.request_to);
                // console.log(friends_list)
                var update_info = new updateListInfo(msg.request_from, friends_list);

                var updateQuery = 'UPDATE users SET friends = \'' + JSON.stringify(friends_list) + '\' WHERE username = \'' + msg.request_from + '\'';
                db.run(updateQuery);

                io.emit('update list in client', update_info);
            })

            db.each('SELECT * FROM users WHERE username = ?', msg.request_to, function (err, data) {
                var friends_list = JSON.parse(data.friends);
                // console.log(friends_list)
                friends_list.push(msg.request_from);
                // console.log(friends_list)
                var update_info = new updateListInfo(msg.request_to, friends_list);

                var updateQuery = 'UPDATE users SET friends = \'' + JSON.stringify(friends_list) + '\' WHERE username = \'' + msg.request_to + '\'';
                db.run(updateQuery);

                io.emit('update list in client', update_info);
            })
        })
    })

    socket.on('attempt to create room', function (msg) {
        db.each('SELECT * FROM users WHERE username = ?', msg.user_to, function (err, data) {
            ifExistFlag = true;

            var friend_list = JSON.parse(data.friends);

            for (var i = 0; i < friend_list.length; i++) {
                if (friend_list[i] == msg.user_from) {
                    ifFriendFlag = true;

                    for (var j = 0; j < rooms.length; j++) {
                        if (rooms[j].room_num == msg.room_num) {
                            roomExistsFlag = true;
                            socket.emit('room already exists', '');
                        }
                    };

                    if (roomExistsFlag == false) {
                        var new_room = new room(msg.user_from, msg.user_to, msg.room_num);
                        // rooms.push(new_room); ////// push for now???



                        io.emit('try create room', new_room);
                    }

                    roomExistsFlag = false;
                }
            };

            if (ifFriendFlag == false) {
                socket.emit('not friend', '');
            }

            ifFriendFlag = false;
            
        }, function () {
            if (ifExistFlag == false) {
                socket.emit('user not exist when create room', msg);
            }

            ifExistFlag = false;
        })
    })

    socket.on('reject to create room', function (msg) {
        io.emit('he reject create room', msg);
    })

    socket.on('accept to create room', function (msg) {
        io.emit('he accept to create room', msg);

        rooms.push(msg); // accept pushed to rooms(including send room request and accepted)

        io.emit('update-private-room', msg);
    })

    socket.on('try to update private room', function (msg) {
        io.emit('update private room', msg);
    })
});


http.listen(port_number, function(){
    console.log('listening on *:' + port_number);
});

