var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email=user.email;
};
module.exports = User;

User.prototype.save = function save(callback) {


    //存入md文档
    var user = {
        name: this.name,
        password: this.password,
        email:this.email
    };


    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //为name属性添加索引
            collection.ensureIndex('name', {
                unique: true
            });
            //写入user文档
            collection.insert(user, {
                safe: true
            }, function(err, user) {
                mongodb.close();
                callback(err, user[0]);
            });
        });
    });
};

User.get = function(username, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        //读取集合
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }


            //查找name=username文档
            collection.findOne({
                name: username
            }, function(err, user) {
                mongodb.close();
                if (user) {
                    //封装为user对象
                   
                   return callback(null, user);
                } else {
                   return callback(err);
                }
            });
        });
    });
};
