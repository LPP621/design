var express = require('express');
var User = require('./models/user');
var Comment = require('./models/comment');
var md5 = require('blueimp-md5');

var router = express.Router();

router.get('/', function (req, res) {
    // console.log(Comment);
    Comment.find(function (err, comments) {
        if (err) {
            return res.status(500).send('Server error')
        }
        res.render('index.html',{
            user: req.session.user,
            comments: comments
        })
        // res.render('index.html', {
        //     user: req.session.user,
        //     comment: req.session.comment
        // });
    });
});

router.get('/login', function (req, res) {
    res.render('login.html')
});

router.post('/login', function (req, res) {
    // 1、获取登录用户信息
    // 2、判断用户名和密码是否正确
    // 3、发送响应
    // console.log(req.body);
    var body = req.body;
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    },function (err, user) {
        // 请求服务器错误
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            })
        }
        // 用户不存在或者密码错误
        if (!user){
            return res.status(200).json({
                err_code: 1,
                message: 'email or password is not exits'
            })
        }
        // 登陆成功，将用户信息存在 session 里面
        // console.log(user);
        req.session.user = user;
        // console.log(req.session.user)
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
});
router.get('/register', function (req, res) {
    res.render('register.html')
});

router.post('/register', function (req, res) {
    // console.log(req.body);
    var body = req.body;
    // 在用户表中找邮箱和用户名
    User.findOne({
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    },function (err,data) {
        // 服务器错误
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
        // 用户名或邮箱已经存在
        if (data) {
            return res.status(200).json({
                err_code:1,
                message: 'email or nickname is already exits'
            });
            return res.send('邮箱或者密码已存在')
        }
        // 对密码进行双重加密
        body.password = md5(md5(body.password));
        // 将 注册信息添加到数据库的用户表中
        new User(body).save(function (err, user) {
            // 服务器错误
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Internal error'
                })
            }
            // 注册成功，使用 session 记录用用户信息
            req.session.user = user;
            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })
        });
    })
});

router.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect('/login')
});
router.get('/add', function (req, res) {
   res.render('add.html',{
       user: req.session.user
   })
});
router.post('/add', function (req, res) {
    console.log(req.body);
    // var myDate = new Date();
    // var date = myDate.getFullYear() +'-'+(myDate.getMonth()+1)+'-'+myDate.getDate();
    // comment.dateTime = date;
    new Comment(req.body).save(function (err, comment) {
        // 服务器错误
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: 'Internal error'
            })
        }
        // 评论成功，使用 session 记录用评论信息
        req.session.comment = comment;
        console.log(comment);
        res.status(200).json({
            err_code: 0,
            message: 'ok'
        })
    });
});

module.exports = router;
