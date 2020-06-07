var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser  = require("body-parser");
var User  = require("./models/user")
var LocalStrategy   = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/auth_demo_app", {useNewUrlParser: true ,  useUnifiedTopology: true });


var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
   secret: "Rishab and Bhuvan is my bestie",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//======
// ROUTE



app.get("/", function(req, res){
	res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
	res.render("secret");
});

//aUTH rOUTES
//sHOW SIGN up form
app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render('register');
		}
			passport.authenticate("local")(req, res, function(){
				res.redirect("/secret");
			});

	});
});
//Login Routes

app.get("/login", function(req, res){
	res.render("login");
});
// middleware
app.post("/login", passport.authenticate("local",{
	successRedirect: "/secret",
	failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
