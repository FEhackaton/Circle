var mongodb=require('./db');
function Comment(name,time,title,comment){
    this.name = name;
    this.time = time;
    this.title = title;
    this.comment = comment;
}
module.exports=Comment;

Comment.prototype.save=function(callback){
    var name =this.name,
        time=this.time,
        title=this.title,
        comment=this.comment;
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                'name':name,

                'title':title
            }, {
                $push:{'comments': comment}
                },
            function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}