const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
router.get('/', async(ctx) => {
    const result = await DB.find('articlecate');
    // console.log(result);
    await ctx.render('admin/articlecate/list', { list: tools.cateToList(result) })
})

router.get('/add', async(ctx) => {
    const result = await DB.find('articlecate', { 'pid': '0' });
    await ctx.render('admin/articlecate/add', {
        list: result
    })
})

router.post('/doAdd', async(ctx) => {
    const addList = ctx.request.body;
    const result = await DB.insert('articlecate', addList);
    if (result) {
        ctx.redirect(ctx.state.__HOST__ + '/admin/art');
    }
})

router.get('/edit', async(ctx) => {
    const id = ctx.query.id;
    const list = await DB.find('articlecate', { "_id": DB.getObjectID(id) });
    const result = await DB.find('articlecate', { 'pid': '0' });
    // console.log(list);
    ctx.render('admin/articlecate/edit', { list: list[0], result });
})

router.post('/doEdit', async(ctx) => {
    console.log(ctx.request.body);
    const title = ctx.request.body.title,
        id = ctx.request.body.id,
        pid = ctx.request.body.pid,
        keywords = ctx.request.body.keywords,
        status = ctx.request.body.status,
        describe = ctx.request.body.describe;
    const list = await DB.update('articlecate', { '_id': DB.getObjectID(id) }, {
        title,
        pid,
        keywords,
        status,
        describe
    });
    ctx.redirect(ctx.state.__HOST__ + '/admin/art')
})

module.exports = router.routes();