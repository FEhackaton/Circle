var mongodb = require('./db');


function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;

//存储文章
Post.prototype.save = function (callback) {
    var date = new Date();
    var time =
    {
        date: (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()).toString()
    }
    //存入数据库的文档
    var post = {
        name: this.name,
        time: time.date,
        title: this.title,
        post: this.post,
        comments: [],
        pv:0

    }
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //读取数据库
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //插入集合
            collection.insert(post, {
                safe: true
            }, function (err, post) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });


    });
}
Post.getTen = function (name, page, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                collection.find(query, {
                    skip: (page - 1) * 5,
                    limit: 5
                }).sort({
                    time: -1
                }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, docs, total);
                });
            })
        })
    })
};
Post.getThree=function(callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find().limit(3).sort({"pv":-1}).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            })
        })
    })
}

Post.getOne = function (name, time, title, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                'name': name,
                'time': time,
                'title': title
            }, function (err, doc) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                if(doc){
                    collection.update({
                        "name":name,
                        "title":title
                    },{
                        $inc:{pv:1}
                    },function(err){
                        mongodb.close();
                        if(err){
                            return callback(err);
                        }
                    })
                }
                callback(null, doc);
            })
        })
    })
}

Post.edit = function (name, time, title, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                'name': name,
                'time': time,
                'title': title
            }, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, doc);
            })
        })
    })
}
Post.update = function (name, time, title, post, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({
                'name': name,
                'time': time,
                'title': title
            }, {
                $set: {post: post}
            }, function (err) {

                mongodb.close();
                if (err) {
                    console.log(111);
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}

Post.remove = function (name, time, title, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //根据用户名、日期和标题查找并删除一篇文章
            collection.remove({
                "name": name,
                "time": time,
                "title": title
            }, {
                w: 1
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};
Post.search = function(keyword, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var pattern = new RegExp(keyword, "i");
            collection.find({
                "title": pattern
            }, {
                "name": 1,
                "time": 1,
                "title": 1
            }).sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};
