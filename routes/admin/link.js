const router = require('koa-router')()
const DB = require('../../model/db.js')
const tools = require('../../model/tools.js')




router.get('/', async(ctx) => {
    const page = ctx.query.page || 1;
    const size = 3
    const list = await DB.find('link', {}, {}, {
        page,
        size,
        sortJson: {
            add_time: -1
        }
    });
    const count = await DB.count('link');
    ctx.render('admin/link/list', { list, page, totalPage: Math.ceil(count / size) })
})


/***************增加******************/
router.get('/add', async(ctx) => {
    ctx.render('admin/link/add');
})

router.post('/doAdd', tools.multer().single('img_url'), async(ctx) => {
    // ctx.body = {
    //     filename: ctx.req.file ? ctx.req.file.filename : '',
    //     body: ctx.req.body
    // }
    let json = {
        title: ctx.req.body.title,
        img_url: ctx.req.file ? ctx.req.file.path.substr(7) : '',
        address: ctx.req.body.address,
        sort: ctx.req.body.sort,
        status: ctx.req.body.status,
        add_time: tools.getTime()
    }
    const list = await DB.insert('link', json);
    if (list) {
        ctx.redirect('/admin/link');
    }
})

/***************编辑******************/
router.get('/edit', async(ctx) => {
    let id = ctx.query.id
    const list = await DB.find('link', { '_id': DB.getObjectID(id) });
    await ctx.render('admin/link/edit', { list: list[0] })
})

router.post('/doEdit', tools.multer().single('img_url'), async(ctx) => {
    let id = ctx.req.body.id;

    if (ctx.req.file) {
        var json = {
            title: ctx.req.body.title,
            img_url: ctx.req.file ? ctx.req.file.path.substr(7) : '',
            address: ctx.req.body.address,
            sort: ctx.req.body.sort,
            status: ctx.req.body.status,
            add_time: tools.getTime()
        }
    } else {
        var json = {
            title: ctx.req.body.title,
            address: ctx.req.body.address,
            sort: ctx.req.body.sort,
            status: ctx.req.body.status,
            add_time: tools.getTime()
        }
    }

    const list = await DB.update('link', { '_id': DB.getObjectID(id) }, json)
    if (list) {
        ctx.redirect('/admin/link');
    }
})
module.exports = router.routes();