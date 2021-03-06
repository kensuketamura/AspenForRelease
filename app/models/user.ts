///<reference path="../../typings/express/express.d.ts" />
///<reference path="../../typings/node/node.d.ts" />

/**
 * ユーザ
 * @class User
 * @constructor
 * @param {String} name 名前
 * @param {String} student_number 学籍番号
 */
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        name:          DataTypes.STRING,
        github_id:     DataTypes.STRING,
        studentNumber: DataTypes.STRING,
        password:      DataTypes.STRING,
        role_admin:    DataTypes.BOOLEAN,
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
                User.hasMany(models.SubmitStatus);
                User.hasMany(models.Lecture);
            },
            /**
             * ログイン状態の確認
             * @method login
             * @param {Object} cond ユーザの検索条件
             * @return {Promise}
             */
            login: (cond) => {
                return User.find({where: cond});
            },
            /**
             * 学生リストを取得する
             * 講義ごとの学生リストはまだ取得できない
             * @method getStudentList
             * @param {Number} lectureId 講義番号
             * @return {Promise}
             */
            getStudentList: () => {
                return User.findAll({where: {role_admin: false}});
            },
            /**
             * 学籍番号からuserを取得する
             * @method findByStudentNumber
             * @param {Number} studentNumber 学籍番号
             * @return {Promise}
             */
            findByStudentNumber: (studentNumber) => {
                return User.find({where: {studentNumber: studentNumber}});
            },
            /**
             * 学生を追加する
             * @method createStudent
             * @param {String} name 氏名
             * @param {String} studentNumber 学籍番号
             * @param {String} password パスワード
             * @param {Boolean} role_admin 管理者権限
             * @return {Promise}
             */
            createStudent: (name, studentNumber, password, role_admin) => {
              return User.create({
                name: name,
                studentNumber: studentNumber,
                password: password,
                role_admin: role_admin,
                createdAt: new Date()
              });
            }
        }
    });
    return User;
};
