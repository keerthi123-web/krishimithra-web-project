var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "krishimithra.info2020@gmail.com",
        pass: "Krishi_mithra20"
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
   
    from: " ", // sender address
	name: "name",
    to: "krishimithra.info2020@gmail.com", // list of receivers
	contact_no: "contact_no",
    subject: 'Sending Email using Node.js', // Subject line
    text: "Hello world ", // plaintext body
    html: "<b>Hello world </b>" // html body
	
}

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
	 console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});
