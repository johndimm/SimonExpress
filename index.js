//TechSide Express JS Server with Handlebars view engine
var express = require('express');
const path = require('path');
var app = express();  //use express js module

//add express handlebars view engine
var handlebars = require('express3-handlebars')
	.create({defaultLayout: 'main'});  //default handlebars layout page

// Add the plain old handlebars to compile a template.
var hbr = require('handlebars');

// For Heroku
var compression = require('compression');
app.use(compression());
var helmet = require('helmet');
app.use(helmet());

//
// Add support for POST.
//
// app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies

//
// Add sendgrid.
//
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.set('views', path.resolve(__dirname, 'views'));

// app.engine('handlebars', handlebars.engine);
// app.set('view engine', 'handlebars'); //sets express view engine to handlebars

app.engine('html', handlebars.engine);
app.set('view engine', 'html');

app.set('port', process.env.PORT || 3000);  //sets port 3000

//
// Test sending data from a static POST.
//
app.post('/receiveForm', function(req, res) {
  var body = JSON.stringify(req.body);
  console.log(body);
  res.send({"response":body});
});

app.get('/test', function(req,res){
        res.send(`
  <!doctype html>
  <form action="/receiveForm" method="post">
    to: <input name="to" />
    <br />
    from: <input name="from" />
    <br />
    message:
    <br />
    <textarea name="message" rows="6" cols="80"></textarea>
    <input type="submit" />
  </form>

  <button onClick="javascript:sendMail()">send POST using javascript</button>
        `);
});

//
// Render a dynamic template created by the user of Mail Merge
//
app.post('/renderTemplate', function (req, res) {
   let template = req.body.template;
   let compiled = hbr.compile(template);

   //
   // req.body has the variables mentioned in the template.
   //
   let response = compiled(req.body);

   //
   // Wrap with json.
   //
   res.send({"response":response});
});


//
// Send email using sendgrid.
//
app.post('/sendMail', function (req, res) {
    const msg = {
      to: req.body.to, // 'test@example.com',
      from: req.body.from, // 'test@example.com',
      subject: 'From node, a very interesting email just for you!!!', // 'Sending with Twilio SendGrid is Fun',
      text: req.body.message //'and easy to do anywhere, even with Node.js',
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    console.log('in sendMail, req.query:' + JSON.stringify(req.body));

    sgMail
      .send(msg)
      .then(() =>res.send({"response":"202 Accepted, Mail sent successfully"}))
      .catch(error => res.send({"response":error.toString()}));

});

app.use(express.static(__dirname + '/public')); 

app.use(function(req,res){  //express catch middleware if page doesn't exist
	res.status(404);  //respond with status code
	res.render('404'); //respond with 404 page
});

app.listen(app.get('port'), function(){ //start express server
	console.log( 'Express Server Started on http://localhost:3000');

});

app.get('/', function(req,res){
	res.render('public/index.html');  //respond with homepage
});

