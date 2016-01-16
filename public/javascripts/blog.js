$(function(){
    $('.alert')&&$('.alert').fadeIn(2000).fadeOut(2000);
    $('span.toReply').click(function(e){
<<<<<<< HEAD
        var inputReply=$(e.target).parent().find('.replyBox');
        inputReply.toggle();

    });
    $('.replyTo').click(function(){
        $('#commentForm').submit();
=======
        var inputReply=$(e.target).parent().find('.reply');
        inputReply.toggle();
>>>>>>> 94ec1a67df95d886b4f8d9f5d31f7709235645c2
    })
})