var socket = io();

var current_username;
var temp_msg;
var temp_room;

function addInfo(request_from, request_to) {
    this.request_from = request_from;
    this.request_to = request_to;
}

function tempUser(username, password) {
    this.username = username;
    this.password = password;
}

function createRoomInfo(user_from, user_to, room_num) {
    this.user_from = user_from;
    this.user_to = user_to;
    this.room_num = room_num;
}

function privateInfo(room_num, user_from, user_to, message) {
    this.room_num = room_num;
    this.user_from = user_from;
    this.user_to = user_to;
    this.message = message;
}

function postInfo(name, message) {
    this.name = name;
    this.message = message;
}

$('#register-panel').hide();
$('#public-chat-room').hide();
$('#on-line-user-panel').hide();
$('#log-out-panel').hide();
$('#private-room-panel').hide();
$('#create-room-button-panel').hide();
$('#friend-list-panel').hide();
$('#friend-search-list').hide();
$('#request-from-other').hide();
$('#create-room-panel').hide();
$('#request-to-create-room').hide();

$('#login-register-button').on('click', function () {
    $('#login-username').val('');
    $('#login-password').val('');

    $('#register-panel').show();
    $('#login-panel').hide();
});

$('#register-register-button').on('click', function () {
    var username = $('#register-username').val();
    var password = $('#register-password').val();
    var newUser = new tempUser(username, password);

    if ((username == '') || (password == '')) {
        if (username == '') {
            $('#register-username').val('');
            $('#register-password').val('');
            alert('Please provide username!');
            return;
        }
        if (password == '') {
            $('#register-username').val('');
            $('#register-password').val('');
            alert('Please set password!');
            return;
        }
        if ((username == '') && (password == '')) {
            $('#register-username').val('');
            $('#register-password').val('');
            alert('Please provide username and password!');
            return;
        }

    }

    socket.emit('register', newUser);
});

$('#register-return-button').on('click', function () {
    $('#register-panel').hide();
    $('#login-panel').show();
})

socket.on('register', function (msg) {
    if (msg == 'fail') {
        alert('Username already exist!')
        return;
    }
    if (msg == 'success') {
        $('#register-panel').hide();
        $('#login-panel').show();
    }
})

$('#login-login-button').on('click', function () {
    var username = $('#login-username').val();
    var password = $('#login-password').val();
    var tryLogin = new tempUser(username, password);

    if ((username == '') || (password == '')) {
        if (username == '') {
            $('#login-username').val('');
            $('#login-password').val('');
            alert('Please provide username!');
            return;
        }
        if (password == '') {
            $('#login-username').val('');
            $('#login-password').val('');
            alert('Please set password!');
            return;
        }
        if ((username == '') && (password == '')) {
            $('#login-username').val('');
            $('#login-password').val('');
            alert('Please provide username and password!');
            return
        }
    }

     socket.emit('login', tryLogin);
})

socket.on('login', function (msg) {
    if (msg.msg == 'wrong password') {
        $('#login-username').val('');
        $('#login-password').val('');
        alert('Wrong password!');
        return;
    }
    if (msg.msg == 'not exist') {
        $('#login-username').val('');
        $('#login-password').val('');
        alert('User does not exist!');
        return;
    }
    if (msg.msg == 'already logged in') {
        $('#login-username').val('');
        $('#login-password').val('');
        alert('User already logged in!');
        return;
    }
    if (msg.msg == 'success') {
        current_username = msg.username;

        $('#login-panel').hide();
        $('#public-chat-room').show();

        socket.emit('update-online-panel', '');
        socket.emit('show-friends-list-when-log-in', current_username);

        $('#login-username').val('');
        $('#login-password').val('');

        $('#on-line-user-panel').show();
        $('#log-out-panel').show();
        $('#private-room-panel').show();
        $('#create-room-button-panel').show();
        $('#friend-list-panel').show();
    }
})

$('#public-chat-button').on('click', function () {
    // console.log($('#public-chat-input').val())

    var msg = new postInfo(current_username, $('#public-chat-input').val())

    socket.emit('send-in-public', msg);
})

socket.on('show-in-public', function (msg) {

    // $('#public-chat-content').append($('<li>').text(msg)); ////////////////////////

    var temp = '';
    temp += '<div class="item" id="public-message">';
    temp += '<img class="ui avatar image" src="image/public.png">';
    temp += '<div class="content">';
    temp += '<a class="header">';
    temp += msg.name;
    temp += '</a>';
    temp += '<div class="description">';
    temp += msg.message;
    temp += '</div>';
    temp += '</div>';
    temp += '</div>';

    $('#public-chat-content').append(temp);

})

socket.on('update-online-list', function (msg) {
    $('#on-line-user-list').empty();

    for (var i = 0; i < msg.length; i++) {
        // $('#on-line-user-list').append($('<li>').text(msg[i]));

        var temp = '';
        temp += '<div class="item">';
        temp += '<img class="ui avatar image" src="image/user.png">';
        temp += '<div class="content">';
        temp += '<div class="header">'
        temp += msg[i];
        temp += '</div>';
        temp += '</div>';
        temp += '</div>';

        $('#on-line-user-list').append(temp);
    };
})

$('#log-out-button').on('click', function () {
    $('#login-panel').show();

    $('#public-chat-room').hide();
    $('#on-line-user-panel').hide();
    $('#log-out-panel').hide();
    $('#private-room-panel').hide();
    $('#create-room-button-panel').hide();
    $('#friend-list-panel').hide();

    socket.emit('update-log-out', current_username);
})

socket.on('update-friends-list', function (msg) {
    $('#friends-list').empty();

    for (var i = 0; i < msg.length; i++) {
        // $('#friends-list').append($('<li>').text(msg[i]));
        var temp = '';
        temp += '<div class="item">';
        temp += '<img class="ui avatar image" src="image/friend.png">';
        temp += '<div class="content">';
        temp += '<div class="header">'
        temp += msg[i];
        temp += '</div>';
        temp += '</div>';
        temp += '</div>';

        $('#friends-list').append(temp);
    };
})

$('#add-friend-button').on('click', function () {
    $('#friend-search-list').show();

    $('#public-chat-room').hide();
    $('#on-line-user-panel').hide();
    $('#log-out-panel').hide();
    $('#private-room-panel').hide();
    $('#create-room-button-panel').hide();
    $('#friend-list-panel').hide();
})

$('#friend-return-button').on('click', function () {
    $('#friend-search-list').hide();

    $('#public-chat-room').show();
    $('#on-line-user-panel').show();
    $('#log-out-panel').show();
    $('#private-room-panel').show();
    $('#create-room-button-panel').show();
    $('#friend-list-panel').show();
})

$('#friend-add-button').on('click', function () {
    var username = $('#friend-search-input').val();

    $('#friend-search-input').val('');
    $('#friend-search-input').focus();

    if (username == '') {
        alert('Please enter valid username!');
        return;
    }

    if (username == current_username) {
        alert('Don\'t add yourself');
        return;
    }

    var info = new addInfo(current_username, username)

    // console.log(info)

    socket.emit('request-to-add', info);
})

socket.on('request-sent', function () {
    $('#friend-search-list').hide();

    $('#public-chat-room').show();
    $('#on-line-user-panel').show();
    $('#log-out-panel').show();
    $('#private-room-panel').show();
    $('#create-room-button-panel').show();
    $('#friend-list-panel').show();
})

socket.on('error-handle-add', function () {
    alert('No such user!');
    return;
})

socket.on('already friends', function (msg) {
    alert('You are already friend with' + msg);
    return;
})

socket.on('receive request', function (msg) {
    if (msg.request_to == current_username) {

        // console.log('from')
        // console.log(msg.request_from)
        // console.log('to')
        // console.log(msg.request_to)

        $('#request-from-who').text(msg.request_from + ' ' + 'wants to add you as friend!')
        $('#request-from-other').show();
        $('#public-chat-room').hide();
        $('#on-line-user-panel').hide();
        $('#log-out-panel').hide();
        $('#private-room-panel').hide();
        $('#create-room-button-panel').hide();
        $('#friend-list-panel').hide();

        temp_msg = msg;
    }
})

$('#reject-request-button').on('click', function () {
    $('#request-from-other').hide();
    $('#public-chat-room').show();
    $('#on-line-user-panel').show();
    $('#log-out-panel').show();
    $('#private-room-panel').show();
    $('#create-room-button-panel').show();
    $('#friend-list-panel').show();
    socket.emit('i reject', temp_msg);
})

$('#accept-request-button').on('click', function () {
    $('#request-from-other').hide();
    $('#public-chat-room').show();
    $('#on-line-user-panel').show();
    $('#log-out-panel').show();
    $('#private-room-panel').show();
    $('#create-room-button-panel').show();
    $('#friend-list-panel').show();
    socket.emit('i agree', temp_msg);

    // console.log('test click')
    // console.log(temp_msg)
})

socket.on('he reject', function (msg) {
    if (current_username == msg.request_from) {

        alert(msg.request_to + ' ' + 'rejected your friend request.');
        return;
    }
})

socket.on('he agree', function (msg) {

    if (current_username == msg.request_from) {

        // console.log(current_username)
        // console.log(msg.request_from)
        // console.log('here twice????')

        alert(msg.request_to + ' ' + 'accepted your friend request.');
        return;
    }
})

socket.on('update list in client', function (msg) {

    if (msg.username == current_username) {
        var list_to_update = msg.friend_list;

        $('#friends-list').empty();

        for (var i = 0; i < list_to_update.length; i++) {
            // $('#friends-list').append($('<li>').text(list_to_update[i]));
            var temp = '';
            temp += '<div class="item">';
            temp += '<img class="ui avatar image" src="image/friend.png">';
            temp += '<div class="content">';
            temp += '<div class="header">'
            temp += list_to_update[i];
            temp += '</div>';
            temp += '</div>';
            temp += '</div>';

            $('#friends-list').append(temp);
        };
    }
})

$('#create-room-button').on('click', function () {
    $('#create-room-panel').show();

    $('#public-chat-room').hide();
    $('#on-line-user-panel').hide();
    $('#log-out-panel').hide();
    $('#private-room-panel').hide();
    $('#create-room-button-panel').hide();
    $('#friend-list-panel').hide();
})

$('#return-create-room').on('click', function () {
    $('#create-room-panel').hide();

    $('#public-chat-room').show();
    $('#on-line-user-panel').show();
    $('#log-out-panel').show();
    $('#private-room-panel').show();
    $('#create-room-button-panel').show();
    $('#friend-list-panel').show();
})

$('#create-create-room').on('click', function () {
    var room_num = $('#room-number-input').val();
    var friend_name = $('#friend-name-input').val();

    if ((room_num == '') || (friend_name == '')) {
        if (room_num == '') {
            alert('Please provide room_num to create!');
            return;
        }
        if (friend_name == '') {
            alert('Please provide the name of your friend to chat with!');
            return;
        }
        if ((room_num == '') && (friend_name == '')) {
            alert('Please provide valid name and room number!');
            return;
        }
    }

    var create_room_info = new createRoomInfo(current_username, friend_name, room_num);

    //console.log('client????????')

    socket.emit('attempt to create room', create_room_info);
})

socket.on('user not exist when create room', function (msg) {
    alert('The user you entered dos not exist!');
    return;
})

socket.on('not friend', function () {
    alert('You are not friend with him.');
    return;
})

socket.on('room already exists', function () {
    alert('Room number already exists!');
    return;
})

socket.on('try create room', function (msg) {
    if (current_username == msg.user_from) {
        $('#create-room-panel').hide();

        $('#public-chat-room').show();
        $('#on-line-user-panel').show();
        $('#log-out-panel').show();
        $('#private-room-panel').show();
        $('#create-room-button-panel').show();
        $('#friend-list-panel').show();
    }
})

socket.on('try create room', function (msg) {
    if (current_username == msg.user_to) {
        $('#room-request-from-who').text(msg.user_from + ' ' + 'wants to create room with you!');
        $('#request-to-create-room').show();
        $('#public-chat-room').hide();
        $('#on-line-user-panel').hide();
        $('#log-out-panel').hide();
        $('#private-room-panel').hide();
        $('#create-room-button-panel').hide();
        $('#friend-list-panel').hide();

        temp_room = msg;
    }
})

$('#reject-room-button').on('click', function () {
    socket.emit('reject to create room', temp_room);

    $('#request-to-create-room').hide();
    $('#public-chat-room').show();
    $('#on-line-user-panel').show();
    $('#log-out-panel').show();
    $('#private-room-panel').show();
    $('#create-room-button-panel').show();
    $('#friend-list-panel').show();
})

socket.on('reject to create room', function (msg) {
    if (current_username == msg.user_from) {
        alert(msg.user_to + ' ' + 'refuses to create room with you');
        return;
    }
})

$('#accept-room-button').on('click', function () {
    socket.emit('accept to create room', temp_room);

    $('#request-to-create-room').hide();
    $('#public-chat-room').show();
    $('#on-line-user-panel').show();
    $('#log-out-panel').show();
    $('#private-room-panel').show();
    $('#create-room-button-panel').show();
    $('#friend-list-panel').show();
})

socket.on('he accept to create room', function (msg) {
    if (current_username == msg.user_from) {
        alert(msg.user_to + ' ' + 'accepts to create room with you');
        return;
    }
})

socket.on('update-private-room', function (msg) {
    if ((current_username == msg.user_to) || (current_username == msg.user_from)) {

        var num = msg.room_num;

        var temp_room_num = msg.room_num;
        var temp_user_from = msg.user_from;
        var temp_user_to = msg.user_to;

        // new div
        var div_id = 'div-' + num; // new div id
        var div_append_content = '<div id=\'' + div_id + '\'></div>';
        $('#private-room-list').append(div_append_content);

        // new list id
        var list_id = 'list-' + num; // new list id
        var list_append_content = '<ul id=\'' + list_id + '\'></ul>';
        var div_query = '#' + div_id;
        $(div_query).append('<p>Here is the content of room ' + msg.room_num + '</p>');
        $(div_query).append(list_append_content);

        // new label id
        var input_id = 'input-' + num;
        var label_append_content = '<label for=\'' + input_id + '\'>Enter:</label>';
        $(div_query).append(label_append_content);

        // new input id
        var input_append_content = '<input id=\'' + input_id + '\' type=\'' + 'text\'' + '>';
        $(div_query).append(input_append_content);

        //new button id
        var button_id = 'button-' + num;
        var button_append_content = '<input type="button" id=\'' + button_id + '\' onclick="pubSend(\''  + temp_room_num + '\',\''+ temp_user_from + '\',\'' + temp_user_to + '\'' + ');">';
        $(div_query).append(button_append_content);
    }
})

function pubSend(room_num, user_from, user_to) {
    var input_id = 'input-' + room_num;
    var input_query = '#' + input_id;
    var input = $(input_query).val();

    if (input == '') {
        alert('please type something to send!');
        return;
    }

    var info = new privateInfo(room_num, user_from, user_to, input);

    socket.emit('try to update private room', info);
}

socket.on('update private room', function (msg) {
    if ((current_username == msg.user_to) || (current_username == msg.user_from)) {
        var list_id = 'list-' + msg.room_num;
        var list_query = '#' + list_id;








        $(list_query).append($('<li>').text(msg.message));
    }
})

window.onbeforeunload = function () {
    $('#login-panel').show();

    $('#public-chat-room').hide();
    $('#on-line-user-panel').hide();
    $('#log-out-panel').hide();
    $('#private-room-panel').hide();
    $('#create-room-button-panel').hide();
    $('#friend-list-panel').hide();

    socket.emit('update-log-out', current_username);
}

window.onunload = function () {
    socket.emit('update-log-out', current_username);
}