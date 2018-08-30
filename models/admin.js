//引用mongoose
var mongoose = require('mongoose');
//加密模块
var crypto = require('crypto');

//定义用户的schema
var adminSchema = mongoose.Schema({
    //用户名
    yonghuming: String,
    //密码
    mima : String
});

//定义用户的model
var admin = mongoose.model('admin', adminSchema);

//添加管理员
exports.addAdmin = function (yonghuming,mima,callback) {
    //先给密码加密
    var jiamidemima = crypto.createHmac('sha256', mima).digest('hex');
    //向数据库保存
    admin.create({"yonghuming" : yonghuming , "mima" : jiamidemima},function(err,doc){
        callback(err,doc)
    });
}