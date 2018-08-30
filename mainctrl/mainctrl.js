var formidable = require('formidable');
var url = require('url');
var admin = require('../models/admin');//管理员表
var user = require('../models/user');//用户表
var carm = require('../models/carm');//汽车表
var leibiecar = require('../models/leibiecar');//汽车类别
var zupinxinxi = require('../models/zupingxinxi');//租凭信息




//----------------------------------------------登录接口------------------------------------------
exports.showLogin = function (req,res) {
    //检测是否登录
    var login = req.session.login == 1 ? true : false;
    var yonghuming = login ? req.session.yonghuming : "";
    //如果登录 显示管理系统页
    //没有登录  显示登录页
    if(yonghuming) {
       res.redirect('./kerenchaxun')
    }else{
        res.render('login');
    }
}
exports.login = function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //登录向后台数据库添加，并将登录记录存入session
        admin.addAdmin(fields.yonghuming,fields.mima,function () {
            req.session.login = 1;
            req.session.yonghuming = fields.yonghuming;
            res.json({"result" : 1});
        })
    });
}
//----------------------------------------------登录接口------------------------------------------



//----------------------------------------------客人查询接口----------------------------------------
exports.showCarm = function (req,res) {
    res.render('kerenchaxun')
}
//Ajax接口，得到所有客人
exports.getAllUser = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 2;
    //寻找条目总数
    user.count({},function(err,count){
        //分页的逻辑就是跳过（skip）多少条，读取（limit）多少条
        //比如每页两条
        //第1页： limit(2)  skip(0)
        //第2页： limit(2)  skip(2)
        //第3页： limit(2)  skip(4)
        //第4页： limit(2)  skip(6)
        //第5页： limit(2)  skip(8)
        //第6页： limit(2)  skip(10)
        user.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}
exports.showAddUser = function(req,res){
    res.render("add");
}
exports.doAddUser = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        user.create({
            "sid" : fields.sid ,
            "yonghuming" : fields.yonghuming ,
            "dianhua" : fields.dianhua ,
            "dizhi" : fields.dizhi ,
            "shenfengzheng" : fields.shenfengzheng ,
            "jiazhao" : fields.jiazhao
        },function(err,result){
            res.json({"result" : 1});
        });
    });
}
//删除客人
exports.deleteUser = function(req,res){
    //拿到学号
    var sid = req.params.sid;

    //寻找这个学号的学生
    user.find({"sid" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}
//呈递更改客人的表单
exports.showUpdateUser = function(req,res){
    //拿到学号
    var sid = req.params.sid;

    //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    user.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.send("查无此人，请检查网址");
            return;
        }

        //呈递页面
        res.render("update",{
            info : results[0]
        });
    });
}
//更改客人的Ajax接口，是post请求接口
exports.updateUser = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        user.find({"sid" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }

            var thestudent = results[0];

            //更改属性
            thestudent.yonghuming = fields.yonghuming;
            thestudent.dianhua = fields.dianhua;
            thestudent.dizhi = fields.dizhi;
            thestudent.shenfengzheng = fields.shenfengzheng;
            thestudent.jiazhao = fields.jiazhao;
            //持久化
            thestudent.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
}
//----------------------------------------------客人查询接口----------------------------------------



//----------------------------------------------归还登记接口----------------------------------------
exports.showGuiHuanDengJi = function(req,res){
    res.render('guihuandengji');
}
exports.getZuPingXinXi = function(req,res){
    zupinxinxi.find({},function (err,result) {
        res.json({"result":result});
    })
}
exports.delZuPingXinXi = function(req,res){
    var name = url.parse(req.url,true).query.name;
    zupinxinxi.find({"qichemingchen":name},function (err,result) {
        if(result.length == 1){
            result[0].remove(function () {
                res.json({"result":1})
            })
        }
       
    })
}
//----------------------------------------------归还登记接口----------------------------------------



//----------------------------------------------租赁登记接口----------------------------------------
exports.showZuLinDengJi = function(req,res){
    res.render('zupindengji');
}
exports.getLeiBie = function(req,res){
        leibiecar.find({}).exec(function(err,results){
            res.json({
                "results" : results
            });
        });
}
exports.getQiCheLeiBie = function(req,res){
    var leibie = url.parse(req.url,true).query.leibie;
    carm.find({"pwd":leibie}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
exports.getUserLeiBie = function(req,res){
        user.find({}).exec(function(err,results){
            res.json({
                "results" : results
            });
        });
}
exports.tijiaoZuPing = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        zupinxinxi.addStudent(fields,function(result){
            res.json({"result" : 1});
        });
        carm.findOne({"name":fields.qichemingchen},function(err,results){
            results.cishu = results.cishu ? results.cishu+ 1 : 1;
            results.save();
        });
    });
}
exports.checkzuchu = function(req,res){
    var name = url.parse(req.url,true).query.name;
    zupinxinxi.find({"qichemingchen":name},function (err,result) {
       if(result.length == 1){
           res.json({'result':1});
           return;
       }else if(result.length == 0){
           res.json({'result':0});
           return;
       }
    })
}
//----------------------------------------------租赁登记接口----------------------------------------



//----------------------------------------------类别档案接口----------------------------------------
exports.showLeiBie = function(req,res){
    res.render('leibiedangan');
}
//删除学生
exports.deleteLeiBie = function(req,res){
    //拿到学号
    var id = req.params.id;

    //寻找这个学号的学生
    leibiecar.find({"id" : id},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}
//执行添加
exports.doAddLeiBie = function(req,res){
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // console.log(fields);
        //数据库持久
        leibiecar.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
//Ajax接口，得到所有学生
exports.getAllLeiBie = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 2;
    //寻找条目总数
    leibiecar.count({},function(err,count){
        leibiecar.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}
//----------------------------------------------类别档案接口----------------------------------------



//----------------------------------------------汽车档案接口----------------------------------------
exports.showQiCheDangAn = function(req,res){
    res.render('qichedangan');
}
exports.getAllQiChe = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 2;
    //寻找条目总数
    carm.count({},function(err,count){
        carm.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}
//更改学生的Ajax接口，是post请求接口
exports.updateQiChe = function(req,res){
    var sid = req.params.sid;
    console.log(sid)
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //更改学生
        // console.log(fields);
        carm.find({"id" :sid},function(err,results){
            var thestudent = results[0];
            // console.log(thestudent);
            //更改属性
            thestudent.id = fields.id;
            thestudent.name = fields.name;
            thestudent.pwd = fields.pwd;
            thestudent.price = fields.price;
            thestudent.flag = fields.flag;
            //持久化
            thestudent.save(function(err){
                if(err){
                    console.log(err);
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
}
//删除学生
exports.deleteQiChe = function(req,res){
    //拿到学号
    var sid = req.params.sid;
    console.log(sid)
    //寻找这个学号的学生
    carm.find({"id" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}
//呈递更改学生的表单
exports.showUpdatQiChe = function(req,res){
    //拿到学号
    var sid = req.params.sid;
    console.log(sid);
    //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    carm.find({"id" : sid},function(err,results){
        console.log(results);
        if(results.length == 0){
            res.send("查无此人，请检查网址");
            return;
        }
        //呈递页面
        res.json({info: results[0]});
    });
}
//执行添加
exports.doAddQiChe = function(req,res){
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // console.log(fields);
        //数据库持久
        carm.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
//----------------------------------------------汽车档案接口----------------------------------------



//----------------------------------------------退出接口----------------------------------------
exports.tuichu = function (req,res) {
    req.session.login = 0;
    req.session.yonhuming = null;
    res.redirect('/')
    return;
}
//----------------------------------------------退出接口----------------------------------------