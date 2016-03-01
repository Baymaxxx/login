module.exports = function(app){
    app.get('/home', function (req,res) {
        if(req.session.user){
            var Museum = global.dbHandel.getModel('museum');
            Museum.find({},function(err,docs){
                res.render('home',{Museums:docs})
            })
        }else {
            req.session.error = '请先登录';
            res.redirect('/login');
        }
    })
}