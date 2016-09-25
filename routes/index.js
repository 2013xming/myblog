var path = require('path');
var Router = require("koa-router");
var router = new Router();
/*var mongoose = require('mongoose');

var schemas = require(path.join(__dirname,'../modules/database/schemas/'));
var models = require(path.join(__dirname,'../modules/database/models/'));*/
var controller = require(path.join(__dirname,'controller.js'));
exports = module.exports = router.routes();
router.get('/',controller.note.index);
router.get('/index',controller.note.index);
router.get('/getnotes',controller.note.ajaxGetNotes);
router.get('/getCoverImage/imgId/:imgId',controller.note.getCoverImage);
router.get('/note',controller.note.notePage);
router.get('/webDescription',controller.note.webDescription);
router.get('/aboutAuthor',controller.note.aboutAuthor);
router.get('/chartshow',controller.note.chartshow);
router.get('/getPageViewRecord',controller.note.getPageViewRecord);

