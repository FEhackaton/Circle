$(function(){
    $('.alert')&&$('.alert').fadeIn(2000).fadeOut(2000);
    $('span.toReply').click(function(e){
        var inputReply=$(e.target).parent().parent().find('.replyBox');
        inputReply.fadeToggle();
        console.log(inputReply);

    });
    $('.replyTo').click(function(){
        $('#commentForm').submit();

    })
})