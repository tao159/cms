const Koa = require('koa'),
    router = require('koa-router')(),
    render = require('koa-art-template'),
    serve = require('koa-static'),
    path = require('path'),
    session = require('koa-session'),
    bodyParser = require('koa-bodyparser'),
    sd = require('silly-datetime'), //格式化日期模块
    jsonp = require('koa-jsonp'),
    api = require('./routes/api.js'),
    admin = require('./routes/admin.js'),
    index = require('./routes/index.js');



/***********实例化************/
var app = new Koa();


/***********配置模板引擎************/
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat: dateFormat = function(value) { //实例化日期配置，扩展模板里的方法
        return sd.format(value, 'YYYY--MM-DD HH:mm')
    }
})

/***********配置静态资源中间件************/

///public/uploads/1542014814703.jpeg
// app.use(serve('.'));  这样写不安全

app.use(serve(__dirname + '/public'));

/**********配置session中间件*************/
app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess',
    maxAge: 864000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true, //每次请求都重新设置session
    renew: false
};
app.use(session(CONFIG, app));

/**********配置bodyParser中间件*************/
app.use(bodyParser());


/**********配置json中间件*************/
app.use(jsonp());

/**********路由*************/

//admin模块
router.use('/admin', admin);

//api模块
router.use('/api', api);

//前台模块
router.use(index);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen('8001');