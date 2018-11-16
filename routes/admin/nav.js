const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');

router.get('/', async(ctx) => {
    const page = ctx.query.page || 1;
    const count = await DB.count('nav', {});
    const size = 3;
    const list = await DB.find('nav', {}, {}, {
        page,
        size,
        sortJson: {
            add_time: -1
        }
    });
    ctx.render('admin/nav/list', {
        list: list,
        page: page,
        totalPages: Math.ceil(count / size)
    });
})

/**增加 */
router.get('/add', async(ctx) => {
    ctx.render('admin/nav/add');
})

// router.post('/doAdd', async(ctx) => {
//     console.log(ctx.req.body)
// })
router.post('/doAdd', async(ctx) => {
    let json = {
        title: ctx.request.body.title,
        address: ctx.request.body.address,
        sort: ctx.request.body.sort,
        status: ctx.request.body.status,
        add_time: tools.getTime()
    }
    const list = await DB.insert('nav', json);
    if (list) {
        ctx.redirect('/admin/nav')
    }
})

//edit
router.get('/edit', async(ctx) => {
    let id = ctx.query.id;
    const list = await DB.find('nav', { '_id': DB.getObjectID(id) });
    ctx.render('admin/nav/edit', {
        list: list[0],
        prevPage: ctx.state.G.prevPage
    })
})

router.post('/doEdit', async(ctx) => {
    let id = ctx.request.body.id
    let json = {
        title: ctx.request.body.title,
        address: ctx.request.body.address,
        sort: ctx.request.body.sort,
        status: ctx.request.body.status,
        add_time: tools.getTime()
    }
    const list = DB.update('nav', { '_id': DB.getObjectID(id) }, json);
    console.log(list)
    if (list) {
        ctx.redirect('/admin/nav');
    }
})

module.exports = router.routes();