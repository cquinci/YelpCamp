var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/user"),
    flash      = require("connect-flash");

//Landing page
router.get("/", function(req, res){
    res.render("landing");
});

// ==============================
// AUTH ROUTES
// ==============================

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//signup logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message)
            return res.render("register")
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic (2nd argument is middleware)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to YelpCamp'
        
    }),function(req,res){
        if (successRedirect){
            req.flash("success", "Welcome to YelpCamp " + req.user.username)
        }
        if (failureRedirect)
            req.flash("error", "Error Logging In")
    });

//logout
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Log out successful!")
    res.redirect("/campgrounds");
});


module.exports = router;