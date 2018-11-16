const router = require('koa-router')();
const tools = require('../../model/tools.js');
const DB = require('../../model/db.js');
const svgCaptcha = require('svg-captcha');

router.get('/', async(ctx) => {
    await ctx.render('admin/login');
})

router.post('/doLogin', async(ctx) => {
    //用body-parser接收post提交数据
    //console.log(ctx.request.body); //{ username: 'admin', password: '123' }


    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let captcha = ctx.request.body.captcha;

    /*
        1.验证用户名和密码是否合法    
        2.数据库匹配数据
    * */
    if (captcha.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()) {
        var data = await DB.find('admin', {
            "username": username,
            "password": tools.md5(password)
        })

        if (data.length > 0) {
            // console.log('成功');
            ctx.session.userInfo = data[0];

            //更新user表，改变用户登录的时间
            DB.update('admin', { "_id": DB.getObjectID(data[0]._id) }, { "last_time": new Date() })

            ctx.redirect(ctx.state.__HOST__ + '/admin');
        } else {
            ctx.render('admin/error', {
                message: '用户名或者密码错误',
                redirect: ctx.state.__HOST__ + '/admin/login'
            })
        }

    } else {
        ctx.render('admin/error', {
            message: '验证码错误',
            redirect: ctx.state.__HOST__ + '/admin/login'
        })
    }
})

//验证码
router.get('/code', async(ctx) => {
    var captcha = svgCaptcha.create({
        size: 4,
        fontSize: 30,
        width: 110,
        height: 34
    });

    //保存生成的验证码
    ctx.session.code = captcha.text;

    //设置响应头
    ctx.response.type = 'image/svg+xml'


    ctx.body = captcha.data;

})

//退出登录
router.get('/loginOut', async(ctx) => {
    ctx.session.userInfo = null;
    ctx.redirect(ctx.state.__HOST__ + '/admin/login');
})

module.exports = router.routes();