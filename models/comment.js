var mongodb=require('./db');
function Comment(postId,comment){
    this.postId=postId;
    this.comment = comment;
}
module.exports=Comment;

Comment.prototype.save=function(callback){
    var comment=this.comment,
        postId=this.postId;
    console.log(this.postId);

    mongodb.open(function(err,db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({
                    'id': postId,

                }, {
                    $push: {comments: comment},

                },

                function(err){

                    mongodb.close();
                    if(err){
                        return callback(err);
                    }

                    callback(null);

                }
            )
        })
    })
}