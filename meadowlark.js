// Require/import the necessary libraries for the webapp.
// (1) express - this provides the express web framework
// (2) handlebars - this provides the handlebars templating framework
// (3) fortune - this provides the fortune random generator framework 
var express = require('express');
var handlebars = require('express-handlebars');
var fortune = require('./lib/fortune.js');

//**********************************************************************
// EXPRESS APP SETUP          
//**********************************************************************

// Create app object and invoke the express() that exported by the Express module to have a web application.
var app = express();

//**********************************************************************
// This is for the view and layout section.
// Set up handlebars for view engine.
// set the app's view engine to 'handlebars'. Map view engine to handlebars.
// Then set the app variable 'view engine' to 'handlebars'
var view = handlebars.create({
	defaultLayout:'main',
	helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}); 
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

//**********************************************************************
// add static middleware section--logo image.
app.use(express.static(__dirname + '/public'));

//**********************************************************************
// Middleware to detect test=1 in the querystring for page testing
app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.set('port', process.env.PORT || 3000);
if(app.get('port') == null)
	console.log('bleat!');

//**********************************************************************
// Ch.7/Partials - want this weather component to be reusable on any 
// page we wanted.
// Created a function to get current weather data -- dummy data.
function getWeatherData(){
	return {
		locations: [
			{
				name: 'Portland',
				forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Overcast',
				temp: '54.1 F (12.4 C)'
			},
			{
				name: 'Bend',
				forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Partly Cloudy',
				temp: '55.0 F (12.8 C)'
			},
			{
				name: 'Manzanita',
				forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Light Rain',
				temp: '55.0 F (12.8 C)'
			}
		]
	};
}
// Create a middleware to inject this data into the res.locals.partials object.
app.use(function(req, res, next){
	if(!res.locals.partials)
		res.locals.partials = {};
	res.locals.partials.weatherContext = getWeatherData();
	next();
});

//**********************************************************************
// replace res.type and res.send (old routes) to res.render (new routes) 
// that use the view from the views directory
app.get('/', function(req, res){
	/*res.type('text/plain');
	res.send('Meadowlark Travel');*/
	res.render('home');
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
app.get('/tours/oregon-coast', function(req, res){
	res.render('tours/oregon-coast');
});
app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate');
});

//**********************************************************************
////////////////////////////////////////////////////////////////////////
///////////////Ch. 6 - The Request and Response Objects/////////////////
////////////////////////////////////////////////////////////////////////
// a very simple Express route to display the information that the 
// browser is sending.
app.get('/headers', function(req, res){
	res.set('Content-type', 'text/plain');
	var s = '';
	for(var name in req.headers) 
		s += name + ': ' + req.headers[name] + '\n';
	res.send(s);
});


//**********************************************************************
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

// Example 6-3. Passing a context to a view, including querystring, cookie, and session values.
app.get('/greeting', function(req, res){
	res.render('about', {
		message: 'welcome',
		style: req.query.style,
		userid: req.cookie.userid,
		username: req.session.username,
	});
});


app.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost:' + 
		app.get('port') + '; press Ctrl-C to terminate.');
});


