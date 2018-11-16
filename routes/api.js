const router = require('koa-router')();

router.get('/', async(ctx) => {
    ctx.body = { 'title': 'api接口' }
})

module.exports = router.routes();