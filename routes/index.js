const router = require('koa-router')();

router.get('/', async(ctx) => {
    ctx.render('default/index')
})


router.get('/news', async(ctx) => {
    ctx.render('default/news')
})


router.get('/server', async(ctx) => {
    ctx.render('default/server')
})

router.get('/about', async(ctx) => {
    ctx.render('default/about')
})

router.get('/case', async(ctx) => {
    ctx.render('default/case')
})

router.get('/connect', async(ctx) => {
    ctx.render('default/connect')
})
module.exports = router.routes();