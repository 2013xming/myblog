var path = require('path');
/*var mongoose = require('mongoose');
var schemas = require(path.join(__dirname,'../modules/database/schemas/'));
var models = require(path.join(__dirname,'../modules/database/models/'));*/
var noteService = require(path.join(__dirname,'../service/note'));
var controller = {
    note:{},
    admin:{}
};
exports=module.exports = controller;

// 首页
controller.note.index = function* (next) {
    var types = yield noteService.getNoteTypes();
    var tags = yield noteService.getNoteTags();
    var latestNotes = yield noteService.getLatestNotes();
    var archives = yield noteService.getArchives();
    yield this.render('index',{layout:false,nav_head:"index",title:"钰溪笔谈",types:types,tags:tags,latestNotes:latestNotes,archives:archives});
}

//获取note的列表数据接口
controller.note.ajaxGetNotes = function* (){
//    console.log(this.query);
    var queryType = decodeURIComponent(this.query.queryType);
    var queryvalue = decodeURIComponent(this.query.value);
    var pageNum = this.query.pageNum;
    var pageSize = this.query.pageSize;
    var data = yield noteService.getNotes(queryType,queryvalue,pageNum,pageSize);
    this.body = data;
}
//图片接口
controller.note.getCoverImage = function*(){
    var imgId = this.params.imgId;
    var imgFile = yield noteService.getCoverImageById(imgId);
    if(imgFile){
        this.res.writeHead(200);
        this.res.write(imgFile, "binary");
        this.res.end();
    }else{
        this.res.writeHead(400, {"Content-Type": "text/plain"});
        this.res.write("error:not found." + "\n");
        this.res.end();
    }
}
//note 详情页
controller.note.notePage = function* () {
    var types = yield noteService.getNoteTypes();
    var tags = yield noteService.getNoteTags();
    var latestNotes = yield noteService.getLatestNotes();
    var archives = yield noteService.getArchives();
    yield this.render('note',{layout:false,nav_head:"index",title:"钰溪笔谈",types:types,tags:tags,latestNotes:latestNotes,archives:archives});
}
//站点说明页
controller.note.webDescription = function* () {
    var types = yield noteService.getNoteTypes();
    var tags = yield noteService.getNoteTags();
    var latestNotes = yield noteService.getLatestNotes();
    var archives = yield noteService.getArchives();
    yield this.render('webDescription',{layout:false,nav_head:"nav_des",title:"钰溪笔谈",types:types,tags:tags,latestNotes:latestNotes,archives:archives});
}
//关于作者页
controller.note.aboutAuthor = function* () {
    var types = yield noteService.getNoteTypes();
    var tags = yield noteService.getNoteTags();
    var latestNotes = yield noteService.getLatestNotes();
    var archives = yield noteService.getArchives();
    yield this.render('aboutAuthor',{layout:false,nav_head:"nav_author",title:"钰溪笔谈",types:types,tags:tags,latestNotes:latestNotes,archives:archives});
}
//图标可视化页
controller.note.chartshow = function* () {
    yield this.render('chartShow',{layout:false});
}
// 可视化数据接口
controller.note.getPageViewRecord = function*(){
    var startTime = this.query.startDate ? new Date(this.query.startDate) : new Date("1990-01-01");
    var endTime = this.query.endDate ? new Date(this.query.endDate) : new Date();
    var pvs = yield noteService.getPageViewRecord(startTime,endTime);
    this.res.setHeader('Content-Type', 'application/json');
    this.body = {status:'success',pvs:pvs};
}