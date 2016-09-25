var path = require('path');
var mongoose = require('mongoose');
var fs = require("fs");
var co = require("co");
var coFs = require('co-fs');
var schemas = require(path.join(__dirname,'../modules/database/schemas/'));
var models = require(path.join(__dirname,'../modules/database/models/'));
var jqueryTool = require(path.join(__dirname,'../modules/self/jqueryTool'))
var noteService = {};
exports= module.exports = noteService;

// 根据笔记类型统计所有类型及相应类型笔记数量
noteService.getNoteTypes = function* (){
//	console.log("enter getNoteTypes");
    var note = mongoose.model('Note',models.Note);
    var types = {};
    try{
        var result = yield note.find({deleted:false},{type:1});
        if(result.length != 0){
            for(var i in result){
                let tps =  result[i].type;
                for(var j=0,len=tps.length;j<len;j++){    //for(var j in tps){}  会出现很多隐藏的属性
                    if(!types[tps[j]]){
                        types[tps[j]] = 1;
                    }else{
                        types[tps[j]] ++;
                    }
                }

            }  //end for result
        } //end if
        return types;
    }
    catch(err){
        console.log(err);
    }
};
// 根据笔记标签统计所有类型及相应类型笔记数量
noteService.getNoteTags = function* () {
//	console.log("enter getNoteTags");
    var note = mongoose.model('Note', models.Note);
    var tags = {};
    try {
        var result = yield note.find({deleted: false}, {tags: 1});
        if (result.length != 0) {
            for(var i in result){
                var tgs =  result[i].tags;
                for(var j=0,len=tgs.length;j<len;j++){    //for(var j in tps){}  会出现很多隐藏的属性
                    if(!tags[tgs[j]]){
                        tags[tgs[j]] = 1;

                    }else{
                        tags[tgs[j]] ++;
                    }
                }
            }  //end for result
        } //end if
        return tags;
    }
    catch (err) {
        console.log(err);
    }
}
//获取最近5条的笔记
noteService.getLatestNotes = function*  (){
    var note = mongoose.model('Note',models.Note);
    try{
        var result = yield note.find({deleted:false},{title:1}).sort({publishDate:'desc'});
        var res = [];
        if(result.length != 0){
            res = result.slice(0,5);
        } //end if
        return res;
    }catch(err){
        console.log(err);
    }
};

// 根据笔记时间统计所有归档及相应归档笔记数量
noteService.getArchives = function* (){
//	console.log("enter getArchives");
    var note = mongoose.model('Note',models.Note);
//	var monthList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var monthList = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    var archives = {};
    try{
        var result = yield note.find({deleted:false},{publishDate:1}).sort({publishDate:'desc'});
        if(result.length != 0){
            for(var i in result){
                var pDate =  result[i].publishDate;
                var arc = pDate.getFullYear() + "/" +monthList[pDate.getMonth()];
                if(!archives[arc])
                    archives[arc] = 1;
                else archives[arc] ++;
            }  //end for result
        } //end if
        return archives;
    }catch (err){
        console.log(err);
    }
};

// note 查找函数
noteService.getNotes = function* (queryname,queryvalue,pageNum,pageSize){
    var note = mongoose.model('Note',models.Note);
    var result = null;
    if(queryname=="time"){       //按时间查询,包括默认查询和归档查询
        if(queryvalue){			//归档查询
            var start =new Date(queryvalue),end = new Date(queryvalue);
            end = new Date(end.setMonth(end.getMonth()+1));
            result = yield note.find({publishDate:{$gte: start, $lte: end},deleted:'false'}).select("-content").sort({publishDate:'desc'});
        }else{			//默认时间查询，查询所有
            result = yield note.find({deleted:'false'}).select("-content").sort({publishDate:'desc'});
        }

    }else if(queryname == "_id"){   //id或者title等的准确查询
        result = yield note.findById({'_id':queryvalue,deleted:'false'});
    }else{				//分类、标签等包含类查询
        result = yield note.find().$where("this."+queryname+".indexOf('"+ queryvalue +"')>=0 && this.deleted ==false").select("-content").sort({publishDate:'desc'});
    }
    var rs = [];
    // result 为非数组对象时，构造数组结果
    if(result && jqueryTool.type(result)==='object'){
        rs.push(result);
    }else{
        rs = result || [];
    }
//		var rs = result || [];
    var size = rs.length;
    var start = 0,end=size;
    if(pageNum && pageSize){
        start = Number(pageNum)*Number(pageSize);
        end = ((Number(pageNum)+1)*Number(pageSize))>size ? size : (Number(pageNum)+1)*Number(pageSize);
        console.log("....pageNum:"+pageNum +"end:"+end);
    }
    console.log("pageNum:"+pageNum +"end:"+end);
    rs = rs.slice(start,end);
    var data = {notes:rs,size:size,end:end};
    return data;
};

//获取note的展示图片
noteService.getCoverImageById = function* (imgId) {
    var file = mongoose.model('File',models.File);
    try{
        var result = yield file.find({fileId:imgId});
        if(result.length>0){
            var re = result[0];
            var imgfile = yield coFs.readFile(re.savedFilename);
            return imgfile;
        }else{
            return null;
        }
    }catch (err){
        console.log(err);
    }
}

//可视化数据接口
noteService.getPageViewRecord = function* (startTime,endTime) {
    var pvs = [];
    var pageView = mongoose.model('PageView',models.PageView);
    try{
        var pvs = yield pageView.find({viewDate:{$gte: startTime, $lte: endTime}}).select("-_id IP baseUrl viewDay province").sort({viewDate:"asc"});
        return pvs;
    }catch(err){
        console.log(err);
    }
}