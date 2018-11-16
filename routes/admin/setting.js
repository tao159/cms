const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');

router.get('/', async(ctx) => {
    ctx.render('admin/setting/index');
})

module.exports = router.routes();