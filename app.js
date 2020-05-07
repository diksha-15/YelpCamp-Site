//const http = require('http');
//const hostname = '127.0.0.1';
//const port = 3000;


var express       = require("express"),
    app           = express(),
    bodyparser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    localstrategy = require("passport-local"),
    user          = require("./models/user"),
    methodOverride= require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    seedDB        = require("./seed");


var campgroundroute = require("./routes/campgrounds");
    commentroute        = require("./routes/comments");
    Authroute       = require("./routes/Auth");
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/yelp_camp",{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("ERROR:", err.message);
});
/*mongoose.connect("mongodb://localhost/yelp_camp" , {useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false});*/
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
//seedDB();  //seed the database
app.use(flash());

//AUTHENTICATION
app.use(require("express-session")({
  secret: "Once upon a time ",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req , res , next){
  res.locals.currentuser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//app.use(campgroundroute);
app.use("/campgrounds" , campgroundroute);
app.use("/campgrounds/:id/comments/" , commentroute);
app.use(Authroute);
app.listen(process.env.PORT, process.env.IP, () => console.log("The YelpCamp Server Has Started!"));
//app.listen(process.env.PORT || port , hostname, function(){
 // console.log(`Server running at http://${hostname}:${port}/`);
//});
