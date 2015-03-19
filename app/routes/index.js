///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/express/express.d.ts'/>
var express = require('express');
var router = express.Router();
var db = require('../models');
var auth = require('../helper/auth');
var formatDate = require('../helper/date').formatDate;
var Promise = require('bluebird');
var config = require('config');
var lodash = require('lodash');
//var md = require("markdown").markdown.toHTML;
var marked = require('marked');
var http = require('../helper/post');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});
var tableHead = ["課題名", "提出状況", "締切"];
/* GET home page. */
router.get('/', function (req, res) {
    if (!auth.isLogin(req)) {
        res.render('top', { basePath: config.base.path });
        return;
    }
    var user_name = "";
    var user_student_id = "";
    db.User.login({ github_id: req.signedCookies.sessionUserId }).then(function (user) {
        if (user == null) {
            throw 'no login';
        }
        user_name = user.name;
        user_student_id = user.studentNumber;
        auth.setStudentNumber(res, user_student_id);
        return db.Subject.getStatusesEachUser(db.Sequelize, db.SubmitStatus, user.id);
    }).then(function (results) {
        var subjects = results[0];
        var submit_statuses = results[1];
        console.log(subjects);
        console.log(submit_statuses);
        var submits = subjects.map(function (subject) {
            return createSubmitView(subject, submit_statuses);
        });
        res.render('list', { tableHead: tableHead, submits: submits, basePath: config.base.path, user_name: user_name, student_id: user_student_id });
    }).catch(function (err) {
        console.log(err);
        res.render('top', { basePath: config.base.path });
    });
});
router.get('/subject/:file', function (req, res) {
    if (!auth.isLogin(req)) {
        res.redirect(config.base.path + '/');
        return;
    }
    db.Subject.find({ where: { id: req.params.file } }).then(function (subject) {
        if (subject) {
            res.render('subject', {
                basePath: config.base.path,
                content: subject.content,
                example: subject.example,
                endAt: formatDate("YYYY-MM-DD", subject.endAt),
                name: subject.name ? subject.name : "",
                is_show_content: false
            });
        }
        else {
            throw new Error('not found');
        }
    }).catch(function (err) {
        console.log(err);
        res.status(404).send('not found.');
    });
});
var activity_option = {
    hostname: config.activity.host,
    port: config.activity.port,
    path: config.activity.path
};
router.get('/editor/:name', function (req, res) {
    if (!auth.isLogin(req)) {
        res.redirect(config.base.path + '/');
        return;
    }
    var userId = 0;
    var user_name = "";
    var user_studentId = "";
    var activity_data = {
        type: 'subject_open',
        data: {},
        subjectId: req.params.name,
        userId: req.signedCookies.sessionUserId
    };
    db.User.find({ where: { github_id: req.signedCookies.sessionUserId } }).then(function (user) {
        userId = user.id;
        user_name = user.name;
        user_studentId = user.studentNumber;
        return db.Subject.find({ where: { id: req.params.name } });
    }).then(function (subject) {
        db.SubmitStatus.find({
            where: db.Sequelize.and({ UserId: userId }, { SubjectId: req.params.name })
        }).then(function (status) {
            if (status) {
                res.render('editorView', {
                    has_content: true,
                    content: subject.example,
                    subject_reset: subject.content,
                    example: status.content,
                    basePath: config.base.path,
                    timestamp: status.updatedAt,
                    md: marked,
                    title: subject.name,
                    is_show_content: true,
                    user_name: user_name,
                    student_id: user_studentId,
                    status_submitted: status.status > 0,
                    status_date: formatDate('YYYY-MM-DD HH:mm', status.updatedAt)
                });
            }
            else {
                http.postJSON(activity_data, activity_option, function (data) {
                    console.log(data);
                });
                res.render('editorView', {
                    has_content: true,
                    content: subject.example,
                    subject_reset: subject.content,
                    example: subject.content,
                    basePath: config.base.path,
                    timestamp: subject.createdAt,
                    md: marked,
                    title: subject.name,
                    is_show_content: true,
                    user_name: user_name,
                    student_id: user_studentId,
                    status_submitted: false
                });
            }
        });
    }).catch(function (err) {
        console.log(err);
        res.status(401).send();
    });
});
router.get('/editor', function (req, res) {
    db.User.find({ where: { github_id: req.signedCookies.sessionUserId } }).then(function (user) {
        res.render('editorView', {
            has_content: false,
            basePath: config.base.path,
            user_name: user.name,
            student_id: user.studentNumber
        });
    }).catch(function (err) {
        console.log(err);
        res.redirect(config.base.path + '/');
    });
});
router.get('/user/:userid', function (req, res) {
    //TODO アクセス制限
    res.redirect(config.base.path + '/');
    return;
    res.render('list', { basePath: config.base.path });
});
router.get('/user/:userId/subject/:subjectId', function (req, res) {
    if (!auth.isLogin(req)) {
        res.redirect(config.base.path + '/');
        return;
    }
    db.SubmitStatus.find({ where: db.Sequelize.and({ UserId: req.params.userId }, { SubjectId: req.params.subjectId }) }).then(function (submit) {
        if (submit) {
            res.render('source_view', { content: submit.content });
        }
        else {
            res.send('Not yet.');
        }
    });
});
router.get('/list/all', function (req, res) {
    var tableHead = ["学籍番号", "氏名", "課題名", "提出状況", "締切"];
    db.Subject.getStatuses(db, 1).then(function (values) {
        var students = values[0].map(function (student) { return [student.studentNumber, student.name, student.id]; });
        var subjects = values[1].map(function (subject) { return [subject.id, subject.name]; });
        var submits = createAllSubmitViews(values[2], values[0], values[1]);
        res.render('all', {
            tableHead: tableHead,
            submits: submits,
            students: students,
            subjects: subjects,
            basePath: config.base.path,
            user_name: '',
            student_id: ''
        });
    });
});
router.get('/subject', function (req, res) {
    if (!auth.isLogin(req)) {
        res.redirect(config.base.path + '/');
        return;
    }
    //db.User.find({where: db.Sequelize.and({github_id: req.signedCookies.sessionUserId}, {admin_role:
    //TODO Check admin role
    res.render('subject', {
        basePath: config.base.path,
        content: '',
        endAt: '',
        name: '',
        is_show_content: false,
        example: '',
        user_name: '',
        student_id: ''
    });
});
router.get('/register', function (req, res) {
    //TODO アクセス制限
    res.render('register', { basePath: config.base.path });
});
function formatEndAt(endAt) {
    return (+endAt.getFullYear() - 2000) + "/" + ((+endAt.getMonth() < 9) ? "0" : "") + (+endAt.getMonth() + 1) + "/" + ((+endAt.getDate() < 10) ? "0" : "") + endAt.getDate();
}
var statusClasses = ["status-notyet-margin", "status-submitted", "status-success"];
var statusClosingClasses = ["status-closing-notyet", "status-submitted", "status-closing-success"];
function chooseClass(status, remainingDays) {
    if (remainingDays > 0) {
        if (remainingDays < 7 && status == 0) {
            return "status-notyet-danger";
        }
        return statusClasses[status];
    }
    else {
        return statusClosingClasses[status];
    }
}
//var statusArray = ["未提出", "提出済", "合格"];
function getStatus(num, submit) {
    switch (num) {
        case 0:
            return "未提出";
        case 1:
            if (submit) {
                return formatDate('YYYY-MM-DD HH:mm', submit.updatedAt) + ' 提出';
            }
            else {
                return '提出済み';
            }
        case 2:
            return "合格";
    }
}
var oneDay = 86400000;
function createAllSubmitViews(submits, students, subjects) {
    var today = new Date();
    var result = [];
    lodash.forEach(subjects, function (subject) {
        //〆切が次の日の0時になるようにする
        var endAt = new Date(subject.endAt.getTime());
        endAt.setDate(subject.endAt.getDate() + 1);
        var remainingDays = (endAt - today) / oneDay;
        var submits_eachSubject = findBySubjectId(submits, subject.id);
        lodash.forEach(students, function (student) {
            var status = 0;
            var submit = findByUserId(submits_eachSubject, student.id)[0];
            if (submit) {
                status = submit.status ? submit.status : 0;
            }
            result.push({
                id: subject.id,
                user_id: student.id,
                student_name: student.name,
                student_number: student.studentNumber,
                subject_name: subject.name,
                status: getStatus(status, submit),
                endAt: formatEndAt(subject.endAt),
                endAtTime: subject.endAt.getTime(),
                cl: chooseClass(status, remainingDays)
            });
        });
    });
    return result;
}
function findByUserId(submit_statuses, userId) {
    return submit_statuses.filter(function (submit) { return submit.UserId == userId; });
}
function findBySubjectId(submit_statuses, subjectId) {
    return submit_statuses.filter(function (submit) { return submit.SubjectId == subjectId; });
}
function createSubmitView(subject, submit_statuses) {
    var today = new Date();
    //〆切が次の日の0時になるようにする
    var endAt = new Date(subject.endAt.getTime());
    endAt.setDate(subject.endAt.getDate() + 1);
    var remainingDays = (endAt - today) / oneDay;
    //var remainingDays = ((<any>subject.endAt) - (<any>today)) / oneDay;
    var status = 0;
    var submitStatus = findBySubjectId(submit_statuses, subject.id);
    if (submitStatus[0]) {
        status = submitStatus[0].status ? submitStatus[0].status : 0;
    }
    return {
        id: subject.id,
        name: subject.name,
        status: getStatus(status, submitStatus[0]),
        endAt: formatEndAt(subject.endAt),
        endAtTime: subject.endAt.getTime(),
        cl: chooseClass(status, remainingDays)
    };
}
module.exports = router;
