///<reference path="../../typings/express/express.d.ts" />
///<reference path="../../typings/node/node.d.ts" />

/**
 * 提出状況を示す
 * @class SubmitStatus
 * @constructor
 * @param {Number} status 提出状況: 0=未提出, 1=提出済み, 2=合格, 3=再提出
 * @param {String} content 提出内容
 *
 */
module.exports = (sequelize, DataTypes) => {
    var SubmitStatus = sequelize.define('SubmitStatus', {
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        content: DataTypes.TEXT,
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
            associate: (models) => {
                SubmitStatus.belongsTo(models.Subject, {foreignKey: 'SubjectId'});
                SubmitStatus.belongsTo(models.User, {foreignKey: 'UserId'});
            },
            /**
             * 提出
             * @method submit
             * @param {String} content 提出内容
             * @param {Number} userId ユーザID
             * @param {Number} subjectId 課題番号
             * @return {Promise}
             */
            submit: (content, userId, subjectId, seq) => {
                return SubmitStatus
                    .find({where: seq.and({UserId: userId}, {SubjectId: subjectId})})
                    .then(function(submit) {
                        if(submit) {
                            submit.content = content;
                            submit.status = 1;
                            return submit.save();
                        } else {
                            console.log("hi");
                            return SubmitStatus.create({
                                UserId: userId,
                                SubjectId: subjectId,
                                content: content,
                                status: 1
                            });
                        }
                    });
            },
            /**
             * 一時保存
             * @method saveTemporary
             * @param {String} content 提出内容
             * @param {Number} userId ユーザID
             * @param {Number} subjectId 課題番号
             * @param {Promise} Promise promise
             * @return {Promise}
             */
            saveTemporary: (content, userId, subjectId, seq, Promise) => {
                return SubmitStatus
                    .find({where: seq.and({UserId: userId}, {SubjectId: subjectId})})
                    .then(function(submit) {
                        if(submit) {
                            if(submit.status == 0) {
                                submit.content = content;
                                return submit.save();
                            } else {
                                return new Promise((resolve) => {
                                    resolve(submit);
                                });
                            }
                        } else {
                            return SubmitStatus.create({
                                UserId: userId,
                                SubjectId: subjectId,
                                content: content,
                                status: 0
                            });
                        }
                    });
            }
        }
    });
    return SubmitStatus;
};
