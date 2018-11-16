const router = require('koa-router')();
const url = require('url');
const ueditor = require('koa2-ueditor');

//配置富文本框
router.all('/editor/controller', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/uploads/ueditor/image/{yyyy}{mm}{dd}/{filename}"
}]))


/*配置中间件，获取url地址 权限判断*/
router.use(async(ctx, next) => {
    //模板引擎配置全局HOST
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;
    const pathName = url.parse(ctx.request.url).pathname.substring(1);
    var urlArr = pathName.split('/');
    // console.log(urlArr);
    //全局的userinfo
    ctx.state.G = {
        splitUrl: urlArr,
        userinfo: ctx.session.userInfo,
        prevPage: ctx.request.headers['referer']
    }

    //权限判断
    if (ctx.session.userInfo) {
        await next();
    } else {
        if (pathName == 'admin/login' || pathName == 'admin/login/doLogin' || pathName == 'admin/login/code') {
            await next();
        } else {
            ctx.redirect('/admin/login');
        }
    }
})


/*********** 路由************/
const index = require('./admin/index.js');
const login = require('./admin/login.js');
const user = require('./admin/user.js');
const manage = require('./admin/manage.js');
const art = require('./admin/art.js');
const article = require('./admin/article.js');
const focus = require('./admin/focus.js');
const link = require('./admin/link.js');
const nav = require('./admin/nav.js');
const setting = require('./admin/setting.js');
router.use(index);

router.use('/login', login);

router.use('/user', user);

router.use('/manage', manage);

router.use('/art', art);

router.use('/article', article);

router.use('/focus', focus);

router.use('/link', link);

router.use('/nav', nav);

router.use('/setting', setting);

module.exports = router.routes();