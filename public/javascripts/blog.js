$(function(){
    $('.alert')&&$('.alert').fadeIn(2000).fadeOut(2000);
    $('span.toReply').click(function(e){
        var inputReply=$(e.target).parent().find('.replyBox');
        inputReply.fadeIn(500);
        console.log(inputReply);

    });
    $('.replyTo').click(function(e){
        $(e.target).parent('form').submit();


    })
})