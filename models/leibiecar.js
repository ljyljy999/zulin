var mongoose = require('mongoose');


var leibieSchema = new mongoose.Schema({
    id  : Number ,
    name : String,
});

//静态方法，增加学生
leibieSchema.statics.addStudent = function(json,callback){
    //增加学生的时候要先检查合法性，验证id是否被占用
    LieBieCar.checkSid(json.id,function(torf){
        if(torf){
            //没有被占用，就保存
            var s = new LieBieCar(json);
            s.save(function(err){
                if(err){
                    console.log(err);
                    callback(-2);  //服务器错误
                    return;
                }
                //发回1这个状态
                callback(1);
            });

        }else{
            //学号被占用了，返回-1
            callback(-1);
        }
    });
}

//验证学号是否存在
leibieSchema.statics.checkSid = function(id,callback){
    this.find({"id" : id} , function(err,results){
        //如果没有相同的id，返回true
        //如果有相同的id返回false
        callback(results.length == 0);
    });
}

//类
var LieBieCar = mongoose.model("leibiecar",leibieSchema);

//暴露
module.exports = LieBieCar;