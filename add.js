var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var nodemailer = require("nodemailer");
var joi = require("joi");

//const db = require("./db");
//const collection = "todo";

//const schema = joi.object().keys({
//    todo : joi.string().require()
//});

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/KrishiMithra');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));

db.once('open', function(callback) {
    console.log("connection succeeded");
})


var add = express()


add.use(bodyParser.json());
add.use(express.static('public'));
add.use(bodyParser.urlencoded({
    extended: true
}));

//subscription code

add.post('/index', function(req, res) {
    //var username = req.body.username;
    //var password = req.body.password;
   
   var e_mail = req.body.e_mail;
   
   
    var data = {
      
	  "e_mail" : e_mail,
        
    }
    db.collection('subscribe').insertOne(data, function(err, collection) {
        if (err) throw err;
		//res.render({title:'subscribed successfully', success:''});
        console.log("Record inserted Successfully");
		
    });

    return res.redirect('index.html');
})

add.get('/',function(req,res){
res.set({
'Access-control-Allow-Origin':'*'
});
return res.redirect('index.html');
})

//contact us page code
add.post('/contact', function(req, res) {
    //var username = req.body.username;
    //var password = req.body.password;
   var name = req.body.name;
   var from = req.body.from;
   var to = req.body.to;
   var contact_no = req.body.contact_no;
   var subject = req.body.subject;
   var content = req.body.content;
   
    var data = {
        "name" : name,
        "from" : from,
        "to" : to,
        "contact_no" : contact_no,
        "subject" : subject,
        "content" : content
    }
    db.collection('contact').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");
    });

    return res.redirect('contact.html');
})

add.get('/',function(req,res){
res.set({
'Access-control-Allow-Origin':'*'
});
return res.redirect('contact.html');
})

//contact us page code ends here

//donate page code
add.post('/donate', function(req, res) {
    //var username = req.body.username;
    //var password = req.body.password;
   var Name = req.body.Name;
   var e_mail = req.body.e_mail;
   var contact_no = req.body.contact_no;
   var Type_of_Donation = req.body.Type_of_Donation;
   var Amount = req.body.Amount;
   
    var data = {
        "Name" : Name,
        "e_mail" : e_mail,
        "contact_no" : contact_no,
        "Type_of_Donation" : Type_of_Donation,
        "Amount" : Amount
    }
    db.collection('DonorRegistration').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");
    });

    return res.redirect('donate.html');
})

add.get('/',function(req,res){
res.set({
'Access-control-Allow-Origin':'*'
});
return res.redirect('donate.html');
})



/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'krishimithra.info2020@gmail.com',
        pass: 'Krishi_mithra20'
    },
    tls: {rejectUnauthorized: false},
    debug:true
});


/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

add.get('/',function(req,res){
	res.sendFile(__dirname + '/contact.html');
});

add.get('/send',function(req,res){
	var mailOptions={
	    //name : req.query.name,
		to : req.query.to,
		//contact_no : req.query.contact_no,
		subject : req.query.subject,
		text : req.query.text,
		
		html:`<h1>Contact details</h1>
        <h2> name:${req.query.name} </h2><br>
		<h2> from:${req.query.from} </h2><br>
        <h2> to:${req.query.to} </h2><br>
		<h2> subject:${req.query.subject} </h2><br>
        <h2> contact_no:${req.query.contact_no} </h2><br>
        <h2> text:${req.query.text} </h2><br>`
		
		
	}
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error, response){
   	 if(error){
        	console.log(error);
		res.end("error");
	 }else{
        	console.log("Message sent: " + response.message);
		res.end("sent");
    	 }
});
});

/*--------------------Routing Over----------------------------*/



add.get('/Admin/index', function(req,res,next) {

//add.get('/Login/index.html', function(req, res) {
    return res.render('/Admin/index');
        //'Access-control-Allow-Origin': '*'
    });
	
add.post('/Admin/index', function(req,res,next) {
     db.collection("AdminLogin").findOne({username:req.body.username},
	 function(err,data){
	 if(data){
	 if(data.password == req.body.password) {
	 
	 //req.session._id = data.unique_id;
	 return res.redirect('/Admin/manage-users.html');
	 } else {
	 res.send({"Success":"Wrong password!"});
	 }
	 } else {
	 res.send({"Success":"This username is not registered"});
	 }
	 });
	 });
	 
//update code
	 
//add.put('/Admin/change-password', (req, res) => {
//db.collection('AdminLogin').findOneAndUpdate ({ _id: ObjectId(req.body._id) }, {$set: {
    //password: req.body.password
    //description: req.body.description
 //}
 //}), function (err, result) {
      //if (err) {
      //console.log(err);
    //} else {
     //console.log("Post Updated successfully");
     //res.render('blog.ejs');
 //}
//})





add.use(passport.initialize());
add.use(passport.session());

add.get('/Admin/logout', function(req, res, next) {
  req.logOut();
  delete req.session;
  res.redirect('../index.html');
});


add.post('/Customer/Registration', function(req, res) {
    //var username = req.body.username;
    //var password = req.body.password;
   var CustomerName = req.body.CustomerName;
   var Contact_no = req.body.Contact_no;
   var e_mail = req.body.e_mail;
   var FirstAddress = req.body.FirstAddress;
   var SecondAddress = req.body.SecondAddress;
   var District = req.body.District;
   var Taluk = req.body.Taluk;
   var PinCode = req.body.PinCode;
   var Password = req.body.Password; 

    var data = {
        "CustomerName" : CustomerName,
        "Contact_no" : Contact_no,
        "e_mail" : e_mail,
        "FirstAddress" : FirstAddress,
        "SecondAddress" : SecondAddress,
        "District" : District,
        "Taluk" : Taluk,
        "PinCode" : PinCode,
        "Password" : Password
       
    }
    db.collection('customerRegistration').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");
    });

    return res.redirect('/Customer/index.html');
})


add.get('/Customer/index', function(req,res,next) {

//add.get('/Login/index.html', function(req, res) {
    return res.render('/Customer/index');
        //'Access-control-Allow-Origin': '*'
    });
	
add.post('/Customer/index', function(req,res,next) {
     db.collection("customerRegistration").findOne({e_mail:req.body.e_mail},
	 function(err,data){
	 if(data){
	 if(data.password == req.body.password) {
	 
	 //req.session.userId = data.unique_id;
	 return res.redirect('/Customer/CustomerPage.html');
	 } else {
	 res.send({"Success":"Wrong password!"});
	 
	 }
	 } else {
	 res.send({"Success":"This email is not registered"});
	 }
	 });
	 });
	 

	 
add.get('/Customer/CustomerPage',function(req,res,next) {
//res.set({
//'Access-control-Allow-Origin':'*'
//});
return res.redirect('/Customer/CustomerPage.html');
})

//customer page code ends here
	 
add.post('/Farmer/Registration', function(req, res) {
    //var username = req.body.username;
    //var password = req.body.password;
   var farmerName = req.body.farmerName;
   var Contact_no = req.body.Contact_no;
   var e_mail = req.body.e_mail;
   var FirstAddress = req.body.FirstAddress;
   var SecondAddress = req.body.SecondAddress;
   var District = req.body.District;
   var Taluk = req.body.Taluk;
   var PinCode = req.body.PinCode;
   var Password = req.body.Password; 

    var data = {
        "farmerName" : farmerName,
        "Contact_no" : Contact_no,
        "e_mail" : e_mail,
        "FirstAddress" : FirstAddress,
        "SecondAddress" : SecondAddress,
        "District" : District,
        "Taluk" : Taluk,
        "PinCode" : PinCode,
        "Password" : Password
       
    }
    db.collection('farmerRegistration').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");
    });

    return res.redirect('/Farmer/index.html');
})


add.get('/Farmer/index', function(req,res,next) {

//add.get('/Login/index.html', function(req, res) {
    return res.render('/Farmer/index');
        //'Access-control-Allow-Origin': '*'
    });
	
add.post('/Farmer/index', function(req,res,next) {
     db.collection("farmerRegistration").findOne({e_mail:req.body.e_mail},
	 function(err,data){
	 if(data){
	 if(data.password == req.body.password) {
	 
	 //req.session.userId = data.unique_id;
	 return res.redirect('/Farmer/FarmerPage.html');
	 } else {
	 res.send({"Success":"Wrong password!"});
	 
	 }
	 } else {
	 res.send({"Success":"This email is not registered"});
	 }
	 });
	 });
	 

	 
add.get('/Farmer/FarmerPage',function(req,res,next) {
//res.set({
//'Access-control-Allow-Origin':'*'
//});
return res.redirect('/Farmer/FarmerPage.html');
}).listen(3000)
	
console.log("server listening at port 3000");

