const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
router.get('/', async(ctx) => {
    const result = await DB.find('admin');
    //console.log(result);
    await ctx.render('admin/manage/list', {
        list: result
    });
})


router.get('/add', async(ctx) => {
    await ctx.render('admin/manage/add');
})

router.post('/doAdd', async(ctx) => {

    const username = ctx.request.body.username,
        password = ctx.request.body.password,
        repassword = ctx.request.body.repassword;
    last_time = new Date(),
        status = 1;
    if (username == '') {
        ctx.body = { "message": "用户名不能为空", "succss": false };
        return false;
    }
    if (password == '') {
        ctx.body = { "message": "密码不能为空", "succss": false };
        return false;
    }
    if (password != repassword) {
        ctx.body = { "message": "两次密码输入不一致", "succss": false };
        return false;
    }


    //查询用户是否存在
    const res = await DB.find('admin', { 'username': username });

    if (res.length > 0) {
        ctx.body = { "message": "此用户已存在", "success": false }
    } else {
        const data = await DB.insert('admin', {
            username,
            password: tools.md5(password),
            last_time,
            status
        })
        if (data.result.ok == 1) {
            ctx.body = { "message": "添加成功", "success": true };
        } else {
            ctx.body = { "message": "添加失败", "success": false };
        }
    }


})


router.get('/edit', async(ctx) => {
    //获取get传值ctx.query
    const result = await DB.find('admin', {
        "_id": DB.getObjectID(ctx.query.id)
    });
    await ctx.render('admin/manage/edit', { list: result[0] });
})

router.post('/doEdit', async(ctx) => {
    const username = ctx.request.body.username,
        password = ctx.request.body.password,
        repassword = ctx.request.body.repassword,
        id = ctx.request.body.id;
    if (password == '') {
        ctx.body = {
            "message": "密码不能为空",
            "succss": false
        };
        return false;
    }
    if (password != repassword) {
        ctx.body = {
            "message": "两次密码输入不一致",
            "succss": false
        };
        return false;
    }
    findData = await DB.find('admin', { "_id": DB.getObjectID(id) });
    if (findData.length > 0) {
        if (tools.md5(password) == findData[0].password) {
            ctx.body = { "message": "新密码不能与旧密码相同", "success": false };
        } else {
            var upData = await DB.update('admin', { "_id": DB.getObjectID(id) }, { "password": tools.md5(password) });
            if (upData.result.n == 1 && upData.result.ok == 1) {
                ctx.body = { "message": "编辑成功", "succss": true };

            } else {
                ctx.body = { "message": "编辑失败", "succss": false };
            }
        }
    } else {
        ctx.body = { "message": "用户不存在", "success": false };
    }
})

router.get('/delete', async(ctx) => {
    ctx.body = '删除用户'
})
module.exports = router.routes();