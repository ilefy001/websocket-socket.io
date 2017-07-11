'use strict';

import Base from './base.js';

export default class extends Base {
    async loginAction(self){
        let password = this.post('password');
        if(password != '') {
            let username = this.post('username');
            let model = this.model('user');
            let data = await model.where({username: username}).find();

            let crypto = require('crypto');
            let md5 = crypto.createHash('md5')
                .update(password)
                .digest('hex');

            md5 = crypto.createHash('md5')
                .update(md5)
                .digest('hex');

            if (data.password == md5) {
                await this.session('userInfo', data);
                this.success(1,'登录成功');
            } else {
                this.fail(1000, '用户名或者密码错误'); //指定错误号和错误信息
            }
        } else {
            return this.display('login');
        }
    }
}