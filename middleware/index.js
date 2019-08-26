var Campground = require("../models/campground"),
    Comment    = require("../models/comment");
var middlewareObj = {};


//Check campground ownership
middlewareObj.checkCampgroundOwnership = function (req, res, next){
    //check authentication
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                //compare ownership to authorized user
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permissions");
                    res.redirect("back");
                }
            }
        });  
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }      
}

//Check comment ownership
middlewareObj.checkCommentOwnership = function(req, res, next){
    //check authentication
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                // does user own comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permissions");
                    redirect("back");
                }
            }
        });  
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }      
}

//Check if logged in 
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;