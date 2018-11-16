const router = require('koa-router')()
const DB = require('../../model/db.js')
const tools = require('../../model/tools.js')


router.get('/', async(ctx) => {
    const page = ctx.query.page || 1;
    const size = 5
    const list = await DB.find('focus', {}, {}, {
        page,
        size
    });
    //获取分页总页数
    const count = await DB.count('focus');
    await ctx.render('admin/focus/list', {
        list,
        page,
        totalPage: Math.ceil(count / size)
    })
})

/*********添加 ***************/
router.get('/add', async(ctx) => {
    await ctx.render('admin/focus/add')
})

router.post('/doAdd', tools.multer().single('img_url'), async(ctx) => {
    // ctx.body = {
    //     filename: ctx.req.file ? ctx.req.file.filename:'',
    //     body:ctx.req.body
    // }
    let json = {
        title: ctx.req.body.title,
        img_url: ctx.req.file ? ctx.req.file.path.substr(7) : '',
        address: ctx.req.body.address,
        sort: ctx.req.body.sort,
        status: ctx.req.body.status
    }

    var data = await DB.insert('focus', json);
    if (data.result.n == 1 && data.result.ok == 1) {
        ctx.redirect('/admin/focus');
    } else {
        console.log('添加失败');
    }
})

/***************编辑***************/
router.get('/edit', async(ctx) => {
    const list = await DB.find('focus', { '_id': DB.getObjectID(ctx.query.id) });
    await ctx.render('admin/focus/edit', {
        list: list[0],
        prevPage: ctx.request.headers['referer']
    })
})

router.post('/doEdit', tools.multer().single('img_url'), async(ctx) => {
    let prevPage = ctx.req.body.prevPage,
        id = ctx.req.body.id,
        title = ctx.req.body.title,
        img_url = ctx.req.file ? ctx.req.file.path : '',
        address = ctx.req.body.address,
        sort = ctx.req.body.sort,
        status = ctx.req.body.status;
    if (img_url) {
        var json = {
            id,
            title,
            img_url,
            address,
            status
        }
    } else {
        var json = {
            id,
            title,
            address,
            status
        }
    }
    var data = await DB.update('focus', { '_id': DB.getObjectID(id) }, json);
    //跳转
    if (prevPage) {
        ctx.redirect(prevPage);

    } else {
        ctx.redirect(ctx.state.__HOST__ + '/admin/focus');
    }
})
module.exports = router.routes();