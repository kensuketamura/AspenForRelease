///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/express/express.d.ts'/>
var express = require('express');
var router = express.Router();
var db = require('../models');
var config = require('config');
var Promise = require('bluebird');
var formatDate = require('../helper/date').formatDate;
var http = require('../helper/post');

router.post('/login', function (req, res) {
    //TODO:DBにアクセスしてユーザー情報を確認
    console.log("Login : " + req.body.studentNumber + " " + (new Date()));
    db.User.login({ studentNumber: req.body.studentNumber }).then(function (user) {
        //ユーザーが存在しないか、パスワードが間違っている
        if (user == null || user.password != req.body.password) {
            res.status(400).json({ error: "Log in Error" });
        }

        res.cookie('user_student_id', req.body.studentNumber, { signed: true });
        res.redirect(config.base.path + '/');
    });
});

router.post('/save', function (req, res) {
    if (!req.signedCookies) {
        res.status(401).json({ error: "error" });
        return;
    }
    var content = req.body.content;
    var subjectId = req.body.subjectId;
    var userStudentId = req.signedCookies.user_student_id;
    db.User.findByStudentNumber(userStudentId).then(function (user) {
        return db.SubmitStatus.saveTemporary(content, user.id, subjectId, db.Sequelize, Promise);
    }).then(function (submit) {
        console.log(submit);
        res.json({});
    }).catch(function () {
        res.status(401).json({ error: "something bad" });
    });
});

var activity_option = {
    hostname: config.activity.host,
    port: config.activity.port,
    path: config.activity.path
};

router.post('/activity', function (req, res) {
    if (!req.signedCookies) {
        res.status(401).json({ error: "error" });
        return;
    }
    var activity_data = {
        type: req.body.type,
        data: req.body.data,
        subjectId: req.body.subjectId,
        userId: req.signedCookies.user_student_id
    };
    console.log(activity_data);
    http.postJSON(activity_data, activity_option, function (data) {
        console.log(data);
    });
    res.json({});
});

router.post('/marking/user/:userId/subject/:subjectId', function (req, res) {
    checkAdmin(req, res).then(function () {
        return db.SubmitStatus.mark(req.body.markingValue, req.params.userId, req.params.subjectId, db.Sequelize);
    }).then(function () {
        res.json({});
    });
});

router.post('/submit', function (req, res) {
    if (!req.signedCookies) {
        res.status(401).json({ error: "error" });
        return;
    }
    var content = req.body.content;
    var subjectId = req.body.subjectId;
    var userStudentId = req.signedCookies.user_student_id;
    console.log("--------" + userStudentId + "--------");
    db.User.findByStudentNumber(userStudentId).then(function (user) {
        return db.SubmitStatus.submit(content, user.id, subjectId, db.Sequelize);
    }).then(function (submit) {
        console.log(submit);
        res.json({ status: submit.status, date: formatDate('YYYY-MM-DD HH:mm', submit.updatedAt) });
    }).catch(function () {
        res.status(401).json({ error: "something bad" });
    });
});

router.post('/subject/new', function (req, res) {
    var subject_name = req.body.name;
    var subject_endAt = req.body.limit;
    if (req.body.limit == null || req.body.limit == 0) {
        subject_endAt = new Date();
    }
    var subject_startAt = new Date();
    var content = req.body.content;
    var example = req.body.example;
    console.log(content);
    db.Subject.createOrUpdate(subject_name, subject_endAt, req.body.subjectId, content, example).then(function (subject) {
        console.log(subject);
        res.redirect(config.base.path + '/');
    }).catch(function (err) {
        console.log(err);
        res.redirect(config.base.path + '/');
    });
});

router.post('/register', function (req, res) {
    var studentNumber = req.body.inputNumber;
    var userName = req.body.inputName;
    var userId = req.signedCookies.sessionUserId;
    console.log(req.signedCookies);
    db.User.find({ where: { github_id: userId } }).then(function (user) {
        user.studentNumber = studentNumber;
        user.name = userName;
        user.save().then(function () {
            res.redirect(config.base.path + '/'); //FIXME
        }, function () {
            console.log('error');
            res.redirect(config.base.path + '/'); //FIXME
        });
    }, function (err) {
        console.log(err);
    });
});

router.post('/register_student', function (req, res) {
    var users = req.body.users;
    console.log(users);
    if (!users)
        return;
    addStudents(users).then(function () {
        console.log("res");
        res.redirect(config.base.path + '/'); //FIXME
    });
});

function addStudents(arr) {
    var student = arr.pop();
    var name = student[0];
    var role_admin = student[1];
    var studentNumber = student[2];
    var password = student[3];
    var p = db.User.createStudent(name, studentNumber, password, role_admin);
    if (arr.length > 0) {
        return p.then(function () {
            console.log(arr);
            return addStudents(arr);
        });
    } else {
        return p;
    }
}

var post_compile_option = {
    hostname: config.compile.host,
    port: config.compile.port,
    path: config.compile.path,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

router.post('/compile', function (req, res) {
    //dest server is configured by default.yaml
    var client_body = req.body;
    if (req.signedCookies.user_student_id) {
        client_body.userId = req.signedCookies.user_student_id;
    }

    http.postJSON(client_body, post_compile_option, function (data) {
        res.json(data);
    });
});

var post_poplar_option = {
    hostname: config.poplar.host,
    port: config.poplar.port,
    path: config.poplar.path,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

router.post('/poplar', function (req, res) {
    var client_body = req.body;
    if (req.signedCookies.user_student_id) {
        client_body.userId = req.signedCookies.user_student_id;
    }

    http.postJSON(client_body, post_poplar_option, function (data) {
        res.json(data);
    });
});

router.post('/dummy/compile', function (req, res) {
    console.log(req);
    var ret = {
        //src: "#include<stdio.h>\n\nint main() {\n\tprintf(\"hello\n\");\n}\n",
        source: "Module.print('hello');",
        message: "",
        error: "Warning: This message is created by mock-up server."
    };
    res.json(ret);
});

router.post('/dummy/poplar', function (req, res) {
    //FIXME
    res.json({});
});

router.post('/dummy/activity', function (req, res) {
    res.json({});
});

function checkAdmin(req, res) {
    return db.User.login({ studentNumber: req.signedCookies.user_student_id }).then(function (user) {
        if (user == null) {
            throw 'no login';
        }
        if (!user.role_admin) {
            res.redirect(config.base.path + '/');
        } else {
            return;
        }
    });
}

module.exports = router;
