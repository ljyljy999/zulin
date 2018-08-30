var express = require("express");//express
var session = require('express-session');//session
var mongoose = require('mongoose');//mongoose
mongoose.connect('mongodb://localhost/carManage');//carManage数据库
var mainctrl = require('./mainctrl/mainctrl');//mainctrl
var app = express();

app.set('view engine','ejs');//模板
app.use(session({
    secret: 'car manage',
    resave: false,
    saveUninitialized: true
}));//session
app.use(express.static('static'));// 静态资源映射

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });
//接口
//----------------------------------------------登录接口------------------------------------------
app.get('/',mainctrl.showLogin);//显示登录
app.post('/login',mainctrl.login);//登录并添加到数据库
//----------------------------------------------登录接口------------------------------------------



//----------------------------------------------客人查询接口----------------------------------------
app.get('/kerenchaxun',mainctrl.showCarm);//显示客人查询页
app.get('/kerenchaxunall', mainctrl.getAllUser);//Ajax接口得到所有客人
app.get('/kerenchaxunadd', mainctrl.showAddUser);	//呈递表单
app.post('/dokerenchaxun', mainctrl.doAddUser);	//Ajax接口保存表单
app.delete  ('/kerenchaxun/:sid'	, mainctrl.deleteUser);
app.get     ('/kerenchaxun/:sid'	, mainctrl.showUpdateUser);		//呈递更改学生表单
app.post    ('/kerenchaxun/:sid'	, mainctrl.updateUser);	//Ajax接口，更改学生
//----------------------------------------------客人查询接口----------------------------------------



//----------------------------------------------归还登记接口----------------------------------------
app.get('/guihuandengji',mainctrl.showGuiHuanDengJi);
app.get('/getzupinxinxi',mainctrl.getZuPingXinXi);
app.get('/delguihuan',mainctrl.delZuPingXinXi);
//----------------------------------------------归还登记接口----------------------------------------



//----------------------------------------------租赁登记接口----------------------------------------
app.get('/zulindengji',mainctrl.showZuLinDengJi);
app.get('/getleibie', mainctrl.getLeiBie);
app.get('/qicheleibie',mainctrl.getQiCheLeiBie);
app.get('/userall',mainctrl.getUserLeiBie);
app.post('/zupingdengji',mainctrl.tijiaoZuPing);
app.get('/checkzuchu',mainctrl.checkzuchu);
//----------------------------------------------租赁登记接口----------------------------------------



//----------------------------------------------类别档案接口----------------------------------------
app.get('/leibiedangan',mainctrl.showLeiBie);
app.delete  ('/leibiedengji/:id'	, mainctrl.deleteLeiBie);
app.post    ('/leibiedengji'			, mainctrl.doAddLeiBie);	//Ajax接口保存表单
app.get     ('/leibiedengjiall'			, mainctrl.getAllLeiBie);	//Ajax接口得到所有学生
//----------------------------------------------类别档案接口----------------------------------------



//----------------------------------------------汽车档案接口----------------------------------------
app.get('/qichedangan',mainctrl.showQiCheDangAn);//显示汽车档案
app.get('/qichedanganall', mainctrl .getAllQiChe)//所有汽车数据
app.post('/qichedangan/:sid'	    , mainctrl.updateQiChe);//Ajax接口，更改
app.delete  ('/delqichedangan/:sid'	, mainctrl.deleteQiChe);//删除
app.get     ('/qichedangan/:sid'	, mainctrl.showUpdatQiChe);	//呈递更改学生表单
app.post    ('/qichedangan'			, mainctrl.doAddQiChe);	//Ajax接口保存表单 增加
//----------------------------------------------汽车档案接口----------------------------------------



//----------------------------------------------退出接口----------------------------------------
app.get('/tuichu',mainctrl.tuichu);
//----------------------------------------------退出接口----------------------------------------

app.listen(3000);







