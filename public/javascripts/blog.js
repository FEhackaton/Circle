$(function(){
    $('.alert')&&$('.alert').fadeIn(2000).fadeOut(2000);
    $('span.toReply').click(function(e){
        var inputReply=$(e.target).parent().find('.replyBox');
        inputReply.toggle();

    });
    $('.replyTo').click(function(){
        $('#commentForm').submit();
    })
})