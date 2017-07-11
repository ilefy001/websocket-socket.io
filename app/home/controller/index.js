'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usernames = {};
var numUsers = 0;
var username = '';
var photo = '';

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  /**
   * index action
   * @return {Promise} []
   */
  _class.prototype.indexAction = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var userInfo;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.session('userInfo');

            case 2:
              userInfo = _context.sent;

              if (think.isEmpty(userInfo)) {
                _context.next = 10;
                break;
              }

              this.assign('username', userInfo.username);
              this.assign('photo', userInfo.photo);
              username = userInfo.username;
              photo = userInfo.photo;
              _context.next = 11;
              break;

            case 10:
              return _context.abrupt('return', this.redirect('user/login'));

            case 11:
              return _context.abrupt('return', this.display());

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function indexAction() {
      return _ref.apply(this, arguments);
    }

    return indexAction;
  }();

  _class.prototype.openAction = function openAction(self) {
    var socket = self.http.socket;
    this.broadcast('new message', {
      username: socket.username,
      message: self.http.data
    });
  };

  /**
   * 新增用户
   * @param self
   * @returns {Promise.<void>}
   */


  _class.prototype.adduserAction = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(self) {
      var socket;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              socket = self.http.socket;
              // we store the username in the socket session for this client

              socket.username = username;
              socket.photo = photo;
              console.log(username);
              // add the client's username to the global list
              usernames[username] = username;
              ++numUsers;
              this.emit('login', {
                numUsers: numUsers
              });
              // echo globally (all clients) that a person has connected
              this.broadcast('userjoin', {
                username: socket.username,
                numUsers: numUsers
              });

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function adduserAction(_x) {
      return _ref2.apply(this, arguments);
    }

    return adduserAction;
  }();

  _class.prototype.closeAction = function closeAction(self) {
    var socket = self.http.socket;
    // remove the username from global usernames list
    if (socket.username) {
      delete usernames[socket.username];
      --numUsers;
      // echo globally that this client has left
      this.broadcast('userleft', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  };

  _class.prototype.chatAction = function chatAction(self) {
    var socket = self.http.socket;
    // we tell the client to execute 'chat'
    this.broadcast('chat', {
      username: socket.username,
      photo: socket.photo,
      message: self.http.data
    });
  };

  _class.prototype.typingAction = function typingAction(self) {
    var socket = self.http.socket;
    this.broadcast('typing', {
      username: socket.username
    });
  };

  _class.prototype.stoptypingAction = function stoptypingAction(self) {
    var socket = self.http.socket;
    this.broadcast('stoptyping', {
      username: socket.username
    });
  };

  _class.prototype.liveAction = function liveAction(self) {
    return this.display();
  };

  return _class;
}(_base2.default);

exports.default = _class;
//# sourceMappingURL=index.js.map