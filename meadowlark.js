var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var fortune = require('./lib/fortune.js');

var app = express();

//******************************************************
// This is for the view and layout section.
// set up handlebars view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//******************************************************


//*************************************************************
// add static middleware section--logo image.
app.use(express.static(__dirname + '/public'));
//*************************************************************


//**************************************************************************************************************
// Middleware to detect test=1 in the querystring for page testing
app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});
//**************************************************************************************************************



app.set('port', process.env.PORT || 3000);

if(app.get('port') == null)
	console.log('bleat!');

//*********************************************************************************************************************
// replace res.type and res.send (old routes) to res.render (new routes) that use the view from the views directory
app.get('/', function(req, res){
	/*res.type('text/plain');
	res.send('Meadowlark Travel');*/
	res.render('home', {pageTestScript: '/qa/tests-global.js'});
});

// Dynamic Content in Views section
// the fortune array has been moved to node_modules/lib/fortune.js for performing "creating your own module".
/*var fortunes = [
	"Conquer your fears or they will conquer you.", 
	"Rivers need springs.",
	"Do not fear what you don't know.",
	"You will have a pleasant surprise.", 
	"Whenever possible, keep it simple."
];*/
app.get('/about', function(req, res){
	/*res.type('text/plain');
	res.send('About Meadowlark Travel');*/
	//var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
	//res.render('about', { fortunes: randomFortune });
	res.render('about', { fortunes: fortune.getFortune(), pageTestScript: '/qa/tests-about.js'});
});

app.get('/contact', function(req, res){
	res.render('contact');
});



// routes for tour pages
app.get('/tours/hood-river', function(req, res){
	res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate');
});
//*********************************************************************************************************************


//*********************************************************************************************************************
// custom 404 page
// 404 catch-all handler (middleware)
app.use(function(req, res){
	//res.type('text/plain');
	res.status(404);
	//res.send('404 - Not Found');
	res.render('404');
});

// custom 500 page
// 500 error-handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	//res.type('text/plain');
	res.status(500);
	//res.send('500 - Sever Error');
	res.render('500');
});
//*********************************************************************************************************************


app.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost:' + 
		app.get('port') + '; press Ctrl-C to terminate.');
});


