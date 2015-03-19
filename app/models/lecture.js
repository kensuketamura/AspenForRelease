///<reference path="../../typings/express/express.d.ts" />
///<reference path="../../typings/node/node.d.ts" />
module.exports = function (sequelize, DataTypes) {
    var Lecture = sequelize.define('Lecture', {
        name: DataTypes.STRING,
        startAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deleteFlag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        classMethods: {
            associate: function (models) {
                Lecture.hasMany(models.User);
                Lecture.hasMany(models.Subject);
            }
        }
    });
    return Lecture;
};
