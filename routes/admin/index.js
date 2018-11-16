const router = require('koa-router')();
const DB = require('../../model/db.js');
router.get('/', async(ctx) => {
    ctx.render('admin/index');
})

router.get('/changeStatus', async(ctx) => {
    console.log(ctx.query)
    var collectionName = ctx.query.collectionName;
    var attr = ctx.query.attr;
    var id = ctx.query.id;

    var result = await DB.find(collectionName, { "_id": DB.getObjectID(id) });
    if (result.length > 0) {
        if (result[0][attr] == 1) {
            var json = {
                [attr]: 0
            }
        } else {
            var json = {
                [attr]: 1
            }
        }
        var update = await DB.update(collectionName, { "_id": DB.getObjectID(id) }, json);

        if (update) {
            ctx.body = { "message": "修改成功", "success": true };
        } else {
            ctx.body = { "message": "修改失败", "success": false };
        }
    } else {
        ctx.body = { "message": "修改失败，参数错误", "success": false };
    }

})

router.get('/changeSort', async(ctx) => {
    var colName = ctx.query.collectionName,
        id = ctx.query.id;
    var json = {
        sort: ctx.query.sortVal
    }
    const data = await DB.update(colName, { '_id': DB.getObjectID(id) }, json);
    if (data) {
        ctx.body = { "message": "修改成功", "success": true };
    } else {
        ctx.body = { "message": "修改失败", "success": false };
    }
})

router.get('/remove', async(ctx) => {
    try {
        const col = ctx.query.collection,
            id = ctx.query.id;
        const result = DB.remove(col, {
            '_id': DB.getObjectID(id)
        })
        ctx.redirect(ctx.state.G.prevPage);
    } catch (err) {
        ctx.redirect(ctx.state.G.prevPage);
    }
})

module.exports = router.routes();