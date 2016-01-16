var express = require('express');
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Comment =require('../models/comment.js');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var page = parseInt(req.query.p) || 1;
    Post.getTen(null,page,function(err,posts,total){
        if(err){
            posts=[];
        }
        res.render('index', {
            title: '首页',
            posts:posts,
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: ((page - 1) * 10 + posts.length) == total,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })

});


//个人中心
router.get('/u/:name', function (req, res) {
    var page = parseInt(req.query.p) || 1;
        User.get(req.params.name,function(err,user){
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('/');
            }
            Post.getTen(user.name,page,function(err,posts,total){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/');
                }
                res.render('user',{
                    title:user.name+'的主页',
                    posts:posts,
                    page: page,
                    isFirstPage: (page - 1) == 0,
                    isLastPage: ((page - 1) * 10 + posts.length) == total,
                    user:req.session.user,
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString()
                });
            });
        });

});

//发布
router.get('/post', checkLogin);
router.get('/post', function (req, res) {
    res.render('post', {
        title: '发布',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()

    });
})

router.post('/post', function (req, res) {
    var curUser = req.session.user,
        post = new Post(curUser.name, req.body.title, req.body.post);
    post.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发布成功');
        res.redirect('/');
    })

});


//注册
//**拉取表单
router.get('/reg', checkNoLogin);
router.get('/reg', function (req, res) {
    res.render('reg', {
        title: "用户注册",
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    })
});


//提交注册
router.post('/reg', checkNoLogin);
router.post('/reg', function (req, res) {
    if (req.body.repeatPassword != req.body.password) {
        req.flash('error', '两次密码不一致');
        return res.redirect('/reg');

    }
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
        name: req.body.username,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (user)
            err = 'Username already exists.';
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');

            res.redirect('/');
        });


    })
});


//登陆
//拉取登录表单
router.get('/login', checkNoLogin);
router.get('/login', function (req, res) {
    res.render('login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()

    })
});


//提交登录
router.post('/login', checkNoLogin);
router.post('/login', function (req, res) {
    var md5 = crypto.createHash('md5'),
        name = req.body.name,
        password = md5.update(req.body.password).digest('base64');

    //监测用户是否存在
    User.get(name, function (err, user) {
        if (!user) {
            req.flash('error', '用户名不存在');
            return res.redirect('/login');
        }
        //密码检测
        if (user.password != password) {
            req.flash('error', '密码错误');
            return res.redirect('/login');
        }

        //校验通过，存入session
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/')
    })
});


//登出
router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');


});



//文章

router.get('/u/:name/:time/:title',function(req,res){
    Post.getOne(req.params.name,req.params.time,req.params.title,function(err,post){
        if(err){
            req.flash('error',err);
            return res.redirect('/');
        }
        res.render('artical',{
            title:req.params.title,
            post:post,
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
})
router.post('/u/:name/:time/:title', function (req, res) {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var comment = {
        name: req.body.name,
        email: req.body.email,
        website: req.body.website,
        time: time,
        content: req.body.content
    };
    var newComment = new Comment(req.params.name, req.params.time, req.params.title, comment);
    newComment.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '留言成功!');
        res.redirect('/');
    });
});
router.get('/edit/:name/:time/:title',checkLogin);
router.get('/edit/:name/:time/:title',function(req,res) {
    var curUser = req.session.user;
    Post.edit(curUser.name, req.params.time, req.params.title, function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        res.render('edit', {
            title: '编辑',
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    })
});

//查询
router.get('/search', function (req, res) {
    Post.search(req.query.keyword, function (err, posts) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        res.render('search', {
            title: "SEARCH:" + req.query.keyword,
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});
router.post('/edit/:name/:time/:title', checkLogin);
router.post('/edit/:name/:time/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
        var url = encodeURI('/u/' + req.params.name + '/' + req.params.time + '/' + req.params.title);
        if (err) {
            req.flash('error', err);
            return res.redirect(url);//出错！返回文章页
        }
        req.flash('success', '修改成功!');
        res.redirect(url);//成功！返回文章页
    });
});
//删除
router.get('/remove/:name/:time/:title', checkLogin);
router.get('/remove/:name/:time/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.remove(currentUser.name, req.params.time, req.params.title, function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', '删除成功!');
        res.redirect('/');
    });
});
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录');
        res.redirect('/login');
    }
    next();
};
function checkNoLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录');
        res.redirect('/')
    }
    next();
}
router.use(function(req,res){
    res.render("404");
})
module.exports = router;
