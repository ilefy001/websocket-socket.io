/**
 * Created by Administrator on 2017/4/27.
 */
export default {
    type: 'file',
    name: 'thinkjs', //对应 cookie 的名称
    secret: '', //Session 对应的 cookie 是否需要加密
    timeout: 24 * 3600, //过期时间，默认为一天
    cookie: { // cookie options
        length: 32
    },
    adapter: {
        file: {
            path: think.RUNTIME_PATH +'/session'
        }
    }
};