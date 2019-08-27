var bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    request         = require("request"),
    express         = require("express"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    seedDB          = require("./seeds"),
    app             = express();

//require models
var User        = require("./models/user"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

//require routes
var indexRoutes      = require("./routes/index"),    
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments");

//require middleware
var middleware = require("./middleware/");
    
//config
mongoose.connect("mongodb+srv://admin:KukaCam412989@cluster0-vcmsq.mongodb.net/yelp_camp?retryWrites=true&w=majority", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); //for style sheet
app.use(methodOverride("_method")); //HTML doesnt support PUT so this will look for arg and treat it as the route specified.
app.set("view engine", "ejs");

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Lifting is cool",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //comes from passport-local-mongoose plugin
passport.deserializeUser(User.deserializeUser());

//flash messaging
app.use(flash());

//This is middle function to access user on every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//ROUTES - the first parameter is appending to route in route file
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//seedDB();

//Server start
app.listen(process.env.PORT || 3000, function() {
	console.log("Server is Listening");
});