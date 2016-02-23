var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/login').get(function(req,res){
  res.render("login").post(function(req,res){
    //get User info
    //�����User���Ǵ�model�л�ȡuser����ͨ��global.dbHandelȫ�ַ��������������app.js���Ѿ�ʵ��)
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;
    User.findOne({name:uname},function(err,doc){
      if(err){
        res.send(500);
        console.log(err);
      }else if(!doc){
        req.session.error = '�û���������';
        res.send(404);
      }else{
        if(req.body.upwd != doc.password){
          req.session.error = '�������';
          res.send(404);
        }else{
          req.session.user = doc;
          res.send(200);
        }
      }
    })
  })
});

router.route("/register.html").get(function(req,res){    // �����·������Ⱦregister�ļ���������titleֵ�� register.htmlʹ��
  res.render("register");
}).post(function(req,res){
  //�����User���Ǵ�model�л�ȡuser����ͨ��global.dbHandelȫ�ַ��������������app.js���Ѿ�ʵ��)
  var User = global.dbHandel.getModel('user');
  var uname = req.body.uname;
  var upwd = req.body.upwd;
  User.findOne({name: uname},function(err,doc){   // ͬ�� /login ·���Ĵ���ʽ
    if(err){
      res.send(500);
      req.session.error =  '�����쳣����';
      console.log(err);
    }else if(doc){
      req.session.error = '�û����Ѵ��ڣ�';
      res.send(500);
    }else{
      User.create({                             // ����һ��user��������model
        name: uname,
        password: upwd
      },function(err,doc){
        if (err) {
          res.send(500);
          console.log(err);
        } else {
          req.session.error = '�û��������ɹ���';
          res.send(200);
        }
      });
    }
  });
});

router.get("/home",function(req,res){
  if(!req.session.user){                     //����/home·�������ж��Ƿ��Ѿ���¼
    req.session.error = "���ȵ�¼"
    res.redirect("/login");                //δ��¼���ض��� /login ·��
  }
  res.render("home");         //�ѵ�¼����Ⱦhomeҳ��
});

/* GET logout page. */
router.get("/logout",function(req,res){    // ���� /logout ·����ǳ��� session��user,error�����ÿգ����ض��򵽸�·��
  req.session.user = null;
  req.session.error = null;
  res.redirect("/");
});
module.exports = router;
