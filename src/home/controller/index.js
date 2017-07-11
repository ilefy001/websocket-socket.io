'use strict';

import Base from './base.js';

var usernames = {};
var numUsers = 0;
var username = '';
var photo = '';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    //auto render template file index_index.html
      let userInfo = await this.session('userInfo');
      if (!think.isEmpty(userInfo)){
          this.assign('username',userInfo.username);
          this.assign('photo',userInfo.photo);
          username = userInfo.username;
          photo = userInfo.photo;
      }else{
          return this.redirect('user/login');
      }
      return  this.display();
  }
  openAction(self){
    var socket = self.http.socket;
    this.broadcast('new message', {
      username: socket.username,
      message: self.http.data
    });
  }

    /**
     * 新增用户
     * @param self
     * @returns {Promise.<void>}
     */
  async adduserAction(self){
    var socket = self.http.socket;
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
  }
  closeAction(self){
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
  }
  chatAction(self){
    var socket = self.http.socket;
    // we tell the client to execute 'chat'
    this.broadcast('chat', {
      username: socket.username,
      photo:socket.photo,
      message: self.http.data
    });
  }
  typingAction(self){
    var socket = self.http.socket;
    this.broadcast('typing', {
      username: socket.username
    });
  }
  stoptypingAction(self){
    var socket = self.http.socket;
    this.broadcast('stoptyping', {
      username: socket.username
    });
  }
  liveAction(self){
    return this.display();
  }
}