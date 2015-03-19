///<reference path="../../typings/express/express.d.ts" />
///<reference path="../../typings/node/node.d.ts" />
var Promise = require('bluebird');
/**
 * Subject
 * @class Subject
 * @constructor
 * @param {String} name 課題名
 * @param {String} content 内容
 * @param {Date} endAt 終了期限
 *
 */
module.exports = function (sequelize, DataTypes) {
    var Subject = sequelize.define('Subject', {
        name: DataTypes.STRING,
        url: DataTypes.STRING,
        content: DataTypes.TEXT,
        example: DataTypes.TEXT,
        startAt: DataTypes.DATE,
        endAt: DataTypes.DATE,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deleteFlag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                Subject.hasMany(models.SubmitStatus);
            },
            /**
             * 全ユーザの提出状況を検索する
             * @method getStatuses
             * @param {Object} db DB
             * @param {Number} lectureId 講義番号
             * @return {Promise} Promise
             */
            getStatuses: function (db, lectureId) {
                var isLecture = { LectureId: lectureId };
                return Promise.all([
                    db.User.getStudentList(lectureId),
                    db.Subject.getList(lectureId),
                    db.SubmitStatus.findAll()
                ]);
            },
            /**
             * 各ユーザの提出状況を検索する
             * @method getStatusesEachUser
             * @param {Object} Seq Sequelize
             * @param {Object} SubmitStatus テーブル
             * @return {Promise} Promise
             */
            getStatusesEachUser: function (Seq, SubmitStatus, userId) {
                var lectureId = { LectureId: 1 /* Default */ };
                var eqUserId = { UserId: userId };
                //left outer join
                return Promise.all([
                    Subject.findAll({ where: lectureId }),
                    SubmitStatus.findAll({ where: eqUserId })
                ]);
            },
            /**
             * 講義ごとの課題一覧を取得する
             * @method getList
             * @param {Number} lecturId 講義id
             * @return {Promise} Promise
             */
            getList: function (lecturId) {
                return Subject.findAll({ where: { LectureId: lecturId } });
            },
            /**
             * subjectIdにマッチしない場合、新しい課題を作成する
             * @method createOrUpdate
             * @param {String} name 課題名
             * @param {Date} endAt 提出期限
             * @param {Number} subjectId 課題ID
             * @param {String} content 内容題
             * @param {String} example 例
             * @return {Promise} Promise
             */
            createOrUpdate: function (name, endAt, subjectId, content, example) {
                return Subject.find({ where: { id: subjectId } }).then(function (subject) {
                    if (subject) {
                        subject.name = name;
                        subject.endAt = endAt;
                        subject.content = content;
                        subject.example = example;
                        return subject.save();
                    }
                    else {
                        return Subject.create({
                            name: name,
                            url: "",
                            content: content,
                            example: example,
                            LectureId: 1,
                            startAt: new Date(),
                            endAt: endAt
                        });
                    }
                });
            }
        }
    });
    return Subject;
};
