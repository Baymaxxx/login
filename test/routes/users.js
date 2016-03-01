module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  app.route('/login').get(function(req,res){
    res.render("login");}).post(function(req,res){
    //get User info
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    //var ary = ccap.get();
    //var txt = ary[0];
    //var buf = ary[1];
    //res.end(buf);
    //console.log(txt);
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;
    console.log(uname);
    User.findOne({phoneNum:uname},function(err,doc){
      console.log(doc);
      if(err){
        res.send(500);
        console.log(err);
      }else if(!doc){
        req.session.error = '用户名不存在';
        res.send(404);
      }else{
        if(req.body.upwd != doc.password){
          req.session.error = '密码错误';
          res.send(404);
        }else{
          req.session.user = doc;
          res.send(200);
        }
      }
    })
  });

  app.route("/register").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("register");}).post(function(req,res){
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;
    var upwd = req.body.upwd;
    var trueName = req.body.trueName;
    var idNum = req.body.idNum;
    var email = req.body.email;
    User.findOne({name: uname},function(err,doc){   // 同理 /login 路径的处理方式
      if(err){
        res.send(500);
        req.session.error =  '网络异常错误！';
        console.log(err);
      }else if(doc){
        req.session.error = '用户名已存在！';
        res.send(500);
      }else{
        User.create({                             // 创建一组user对象置入model
          phoneNum: uname,
          password: upwd,
          trueName:trueName,
          idNum:idNum,
          email:email
        },function(err,doc){
          if (err) {
            res.send(500);
            console.log(err);
          } else {
            req.session.error = '用户名创建成功！';
            res.send(200);
          }
        });
      }
    });
  });
  /* GET logout page. */
  app.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
  });
};
