/**
 * Created by Administrator on 2017/4/20.
 */

var FADE_TIME = 150; // ms
var TYPING_TIMER_LENGTH = 400; // ms
var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];


// Initialize varibles
var $window = $(window);
var $usernameInput = $('.usernameInput'); // Input for username
var $messages = $('#messages'); // Messages area
var $inputMessage = $('#inputMessage'); // Input message input box

var $loginPage = $('.login.page'); // The login page
var $chatPage = $('.chat.page'); // The chatroom page

// Prompt for setting a username
var username;
var connected = false;
var typing = false;
var lastTypingTime;
var $currentInput = $usernameInput.focus();

var socket = io('http://localhost:8360');

function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
        message += "there's 1 participant";
    } else {
        message += "there are " + data.numUsers + " participants";
    }
    log(message);
}

// Sets the client's username
function setUsername () {
    username = cleanInput($.trim($usernameInput.val()));
    username = 'test';
    // If the username is valid
    if (username) {
        $loginPage.fadeOut();
        $chatPage.show();
        $loginPage.off('click');
        $currentInput = $inputMessage.focus();

        // Tell the server your username
        socket.emit('adduser', username);
    }
}

// Sends a chat message
function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
        $inputMessage.val('');
        addChatMessage({
            username: username,
            message: message
        });
        // tell server to execute 'new message' and send along one parameter
        socket.emit('chat', message);
    }
}

// Log a message
function log (message, options) {
    var $el = $('<li style="display:block"/>').addClass('log').text(message);
    addMessageElement($el, options);
}

// Adds the visual chat message to the message list
function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
        options.fade = false;
        $typingMessages.remove();
    }

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"></li>')
        .data('username', data.username)
        .addClass(typingClass);

    var $messageDiv = $('#msg_tpl').html(); //信息模板
    $messageDiv = $messageDiv.replace(/%username/g,data.username);
    $messageDiv = $messageDiv.replace(/%message/g,data.message);

    if (username == data.username) {
        $messageDiv = $messageDiv.replace(/%float/g,'right');
        $messageDiv = $messageDiv.replace(/%photo/g,'/static/img/user8-128x128.jpg');
    } else {
        $messageDiv = $messageDiv.replace(/%float/g,'');
        $messageDiv = $messageDiv.replace(/%photo/g,'/static/img/user3-128x128.jpg');
    }
    addMessageElement($messageDiv, options);
}

// Adds the visual chat typing message
function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
}

// Removes the visual chat typing message
function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
        $(this).remove();
    });
}

// Adds a message element to the messages and scrolls to the bottom
// el - The element to add as a message
// options.fade - If the element should fade-in (default = true)
// options.prepend - If the element should prepend
//   all other messages (default = false)
function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
        options = {};
    }
    if (typeof options.fade === 'undefined') {
        options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
        options.prepend = false;
    }

    // Apply options
    if (options.fade) {
        $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
        $messages.prepend($el);
    } else {
        $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
}

// Prevents input from having injected markup
function cleanInput (input) {
    return $('<div/>').text(input).text();
}

// Updates the typing event
function updateTyping () {
    if (connected) {
        if (!typing) {
            typing = true;
            socket.emit('typing');
        }
        lastTypingTime = (new Date()).getTime();

        setTimeout(function () {
            var typingTimer = (new Date()).getTime();
            var timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                socket.emit('stoptyping');
                typing = false;
            }
        }, TYPING_TIMER_LENGTH);
    }
}

// Gets the 'X is typing' messages of a user
function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
        return $(this).data('username') === data.username;
    });
}

// Gets the color of a username through our hash function
function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
}