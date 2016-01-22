var nodemailer =require('nodemailer');
module.exports=function(){
    var mailTranspPort=nodemailer.createTransport('smtp',{
        host:'smtp.qq.com',
        service: 'QQ',
        port:'465',
        secureConnection: true,
        auth: {
            user: '1259559060@qq.com',
            pass: '*****'
        }
    });
    var from ='1259559060@qq.com';

    return{
        send:function(to,subject,body,callback) {
            mailTranspPort.sendMail({
                from: from, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                html: body, // html body
                generateTextFromHtml: true
            }, function (err) {
                if (err) {
                    console.error('send error：' + err);
                }else{
                    callback();
                }
            });
        }



    }

}
