var koa = require('koa');
var path = require('path');
var app = koa();
var koaStaticCache = require('koa-static-cache');
var router = require(path.join(__dirname,'routes'));
var render = require('koa-ejs');
require(path.join(__dirname,'modules/database/index.js'));
render(app,{
	root:path.join(__dirname,'views'),
	layout:'index',
	viewExt:'html',
	cache:false,
	debug:true
});
app.use(koaStaticCache(path.join(__dirname, 'public'),{prefix:'/public',gzip:true}));
app.use(router);
app.use(function* () {
	yield this.render('404',{layout:false});
});
app.listen(4088);