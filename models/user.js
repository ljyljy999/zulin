var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    sid:Number,
    yonghuming: String,
    dianhua:String,
    dizhi:String,
    shenfengzheng:String,
    jiazhao:String
})

userSchema.static.checkSid = function (sid,callback) {
    this.find({"sid":sid},function (err,results) {
        callback(results.length == 0)
    })
}

userSchema.static.addStudent = function (json,callback) {
    User.checkSid(json.sid,function (torf) {
        if(torf){
            var s = new User(json);
            s.save(function (err) {
                if(err){
                    callback(-2)
                }
                callback(1)
            })
        }else{
            callback(-1)
        }
    })
}

var User = mongoose.model("user",userSchema);
module.exports = User

