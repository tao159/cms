const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const multer = require('koa-multer');


//配置图片上传
var storage = multer.diskStorage({
    //定义文件保存路径
    destination: function(req, file, cb) {
        cb(null, './public/uploads/'); //路径根据具体而定。如果不存在的话会自动创建一个路径
    }, //注意这里有个，
    //修改文件名
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

var upload = multer({
    storage: storage
});


router.get('/', async(ctx) => {
    const page = ctx.query.page || 1;
    const size = 5
    const list = await DB.find('article', {}, {}, {
        page,
        size,
        sortJson: {
            "edit_time": -1
        }
    });


    //获取分页总页数
    const count = await DB.count('article');
    console.log(list)
    await ctx.render('admin/article/list', {
        list,
        page,
        totalPage: Math.ceil(count / size)
    });
})


/************添加 **************/
router.get('/add', async(ctx) => {
    //查询分类数据
    var classify = await DB.find('articlecate');
    console.log(tools.cateToList(classify))
    await ctx.render('admin/article/add', {
        classify: tools.cateToList(classify)
    });
})

router.post('/doAdd', upload.single('img_url'), async(ctx) => {

    let json = {
        pid: ctx.req.body.pid,
        datename: ctx.req.body.catename.trim(),
        title: ctx.req.body.title,
        author: ctx.req.body.author,
        status: ctx.req.body.status,
        is_best: ctx.req.body.is_best,
        is_hot: ctx.req.body.is_hot,
        is_new: ctx.req.body.is_new,
        keywords: ctx.req.body.keywords,
        description: ctx.req.body.description || '',
        content: ctx.req.body.content || '',
        img_url: ctx.req.file ? ctx.req.file.path.substr(7) : '',
        edit_time: tools.getTime()
    }
    console.log(json);
    var data = await DB.insert('article', json);
    if (data.result.n == 1 && data.result.ok == 1) {
        ctx.redirect('/admin/article');
    } else {
        console.log('添加失败');
    }
})

/************编辑**************/
router.get('/edit', async(ctx) => {
    let id = ctx.query.id
    var classify = await DB.find('articlecate');
    var list = await DB.find('article', { "_id": DB.getObjectID(id) });
    // console.log(list);
    ctx.render('admin/article/edit', {
        classify: tools.cateToList(classify),
        list: list[0],
        prevPage: ctx.request.headers['referer']
    });
})

router.post('/doEdit', upload.single('img_url'), async(ctx) => {
    let prevPage = ctx.req.body.prevPage || ''; /*上一页的地址*/
    let id = ctx.req.body.id;
    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename.trim();
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    let pic = ctx.req.body.author;
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description || '';
    let content = ctx.req.body.content || '';
    let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : '';
    if (img_url) {
        var json = {
            pid,
            catename,
            title,
            author,
            status,
            is_best,
            is_hot,
            is_new,
            keywords,
            description,
            content,
            img_url
        }
    } else {
        var json = {
            pid,
            catename,
            title,
            author,
            status,
            is_best,
            is_hot,
            is_new,
            keywords,
            description,
            content
        }
    }

    var data = await DB.update('article', { "_id": DB.getObjectID(id) }, json);
    //跳转
    if (prevPage) {
        ctx.redirect(prevPage);

    } else {
        ctx.redirect(ctx.state.__HOST__ + '/admin/article');
    }
})

module.exports = router.routes()